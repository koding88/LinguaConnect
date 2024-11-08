import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Header from '@/components/header/Header'
import { Button } from '@/components/ui/button'
import ListPost from '@/components/posts/ListPost'
import usePostZ from '@/zustand/usePostZ'
import useUserZ from '@/zustand/useUserZ'
import { useAuthContext } from '@/context/AuthContext'
import Follower from '@/components/follower/Follower'
import { toast } from 'react-toastify'
import { CiCamera } from "react-icons/ci";
import UProfileDialog from '@/components/dialog/UProfileDiaglog'
import { getFlagImage } from '@/utils/flag'
import Error from '@/components/Error'
import Spinner from '@/components/Spinner' // Giả sử bạn có component Spinner

const Profile = () => {
    const { userId } = useParams()
    const { authUser, setAuthUser } = useAuthContext()
    const [user, setUser] = useState(null)
    const { posts, getAllPosts } = usePostZ()
    const { getProfile, followUser, updateAvatar, updateProfile } = useUserZ()
    const [userPosts, setUserPosts] = useState([])
    const [isFollowing, setIsFollowing] = useState(false)
    const [followersCount, setFollowersCount] = useState(0)
    const [lastFollowTime, setLastFollowTime] = useState(0)
    const fileInputRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const handleSubmit = async (data) => {
        const { full_name, username, gender, birthday, location } = await updateProfile(data);
        const updatedInfo = { full_name, username, gender, birthday, location };
        setUser((prev) => ({ ...prev, ...updatedInfo }));
        setAuthUser((prev) => ({ ...prev, ...updatedInfo }));
        await getAllPosts(true)
    };

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                if (userId) {
                    const profile = await getProfile(userId)
                    if (profile) {
                        setUser(profile)
                        setIsFollowing(profile.followers.some(f => f._id === authUser?._id))
                        setFollowersCount(profile.followers.length)
                    }
                    await getAllPosts(true)
                }
            } catch (err) {
                setError("Failed to load profile")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [userId, getProfile, getAllPosts, authUser?._id])

    useEffect(() => {
        if (user && posts.length) {
            setUserPosts(posts.filter(p => p?.user?._id === user?._id))
        }
    }, [user, posts])

    const handleFollowToggle = useCallback(async () => {
        if (Date.now() - lastFollowTime < 5000) {
            toast.error("Please wait a moment before following or unfollowing again")
            return
        }
        const updated = await followUser(userId)
        if (updated) {
            setIsFollowing(prev => !prev)
            setFollowersCount(prev => isFollowing ? prev - 1 : prev + 1)
            setLastFollowTime(Date.now())
        }
    }, [followUser, userId, isFollowing, lastFollowTime])

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const formData = new FormData();
                formData.append('files', file);
                const updatedUser = await updateAvatar(formData);
                if (updatedUser) {
                    setUser(updatedUser);
                    setAuthUser((prev) => ({ ...prev, avatarUrl: updatedUser.avatarUrl }));
                }
            } catch (error) {
                toast.error(error.response?.data?.message || "Error updating avatar");
            }
        }
    }

    if (isLoading) {
        return (
            <>
                <Header props={{ path: -1, title: "Loading..." }} />
                <div className='flex-grow flex flex-col h-screen overflow-hidden items-center justify-center'>
                    <Spinner />
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header props={{ path: -1, title: "Error" }} />
                <div className='flex-grow flex flex-col h-screen overflow-hidden'>
                    <Error content={error} />
                </div>
            </>
        )
    }

    return (
        <>
            <Header props={{ path: -1, title: user?.username }} />
            <div className='flex-grow flex flex-col h-screen overflow-hidden'>
                <div className='bg-white rounded-tl-[28px] rounded-tr-[28px] flex-1 border-[1px] border-[#D5D5D5] flex flex-col overflow-hidden'>
                    <div className="flex flex-col h-full">
                        {user ? (
                            <>
                                <div className="border-b border-[#D5D5D5] p-4">
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-4">
                                                <h2 className="text-2xl font-semibold">{user?.full_name}</h2>
                                                <p className="text-gray-500">@{user?.username}</p>
                                                <p className="mt-4 text-sm text-justify flex items-center">
                                                    {user?.gender ? "He" : "She"} from {user?.location}
                                                    {user?.location && (
                                                        <span className="ml-2">
                                                            <img
                                                                src={getFlagImage(user?.location)}
                                                                width="30"
                                                                alt={user?.location}
                                                            />
                                                        </span>
                                                    )}
                                                </p>
                                                <Follower followersCount={followersCount} followers={user?.followers} />
                                            </div>
                                            <div className="flex-shrink-0 relative">
                                                <img
                                                    src={user?.avatarUrl}
                                                    alt={user?.username}
                                                    className={`w-28 h-28 rounded-full border-2 border-gray-300`}
                                                />
                                                {authUser?._id === user?._id && (
                                                    <>
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                            accept="image/*"
                                                        />
                                                        <div
                                                            className="absolute bottom-0 right-0 bg-white p-1 rounded-full cursor-pointer"
                                                            onClick={() => fileInputRef.current.click()}
                                                        >
                                                            <CiCamera size={24} />
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {authUser?._id === user?._id ? (
                                            <UProfileDialog props={user} onSubmit={handleSubmit} />
                                        ) : (
                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    className={`flex-1 py-2 w-24 ${isFollowing ? 'bg-white text-black border border-black' : 'bg-black text-white'} rounded-[8px] transition-all duration-200 ease-linear`}
                                                    onClick={handleFollowToggle}
                                                >
                                                    <span className='text-md transition-all duration-200 ease-linear'>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                                                </button>
                                                <button className="flex-1 py-2 w-24 bg-black text-white border border-black rounded-[8px]">
                                                    Message
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Error content='profile' />
                        )}
                        <div className="flex-1 overflow-y-auto">
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold mb-4">Posts</h3>
                                    <ListPost posts={userPosts} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Profile
