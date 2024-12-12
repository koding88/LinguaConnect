import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Header from '@/components/header/Header'
import ListPost from '@/components/posts/ListPost'
import usePostZ from '@/zustand/usePostZ'
import useUserZ from '@/zustand/useUserZ'
import { useAuthContext } from '@/context/AuthContext'
import { toast } from 'react-toastify'
import UProfileDialog from '@/components/dialog/UProfileDiaglog'
import { getFlagImage } from '@/utils/flag'
import Error from '@/components/Error'
import Spinner from '@/components/Spinner'
import {
    MessageCircle,
    UserPlus,
    UserMinus,
    MapPin,
    Mail,
    Users,
    PenSquare,
    ImagePlus,
    Calendar,
    Image,
    Cake,
    User2
} from 'lucide-react'
import useConversationZ from '@/zustand/useConversationZ'
import { useNavigate } from 'react-router-dom'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { extractTime } from '@/utils/extractTime';

const Profile = () => {
    const { userId } = useParams()
    const { authUser, setAuthUser } = useAuthContext()
    const [user, setUser] = useState(null)
    const { userPosts, getPostByUserId } = usePostZ()
    const { getProfile, followUser, updateAvatar, updateProfile } = useUserZ()
    const [isFollowing, setIsFollowing] = useState(false)
    const [followersCount, setFollowersCount] = useState(0)
    const [lastFollowTime, setLastFollowTime] = useState(0)
    const fileInputRef = useRef(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const { setSelectedConversation } = useConversationZ()
    const navigate = useNavigate()

    const handleSubmit = async (data) => {
        try {
            const formattedData = {
                ...data,
                birthday: data.birthday,
                favoriteTopics: Array.isArray(data.favoriteTopics) ? data.favoriteTopics : []
            };

            const updatedUser = await updateProfile(formattedData);

            if (updatedUser) {
                const newUserData = {
                    ...user,
                    ...updatedUser,
                };

                setUser(newUserData);
                
                // Update authUser with the new data
                const updatedAuthUser = {
                    ...authUser,
                    ...updatedUser
                };
                setAuthUser(updatedAuthUser);
                
                // Store updated user in localStorage to persist across refreshes
                localStorage.setItem('user', JSON.stringify(updatedAuthUser));

                await getPostByUserId(userId);
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
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
                    await getPostByUserId(userId)
                }
            } catch (err) {
                setError("Failed to load profile")
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [userId, getProfile, getPostByUserId, authUser?._id])

    // Sort posts by date
    const sortedUserPosts = [...userPosts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

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

    const handleMessageClick = () => {
        setSelectedConversation({
            _id: user._id,
            full_name: user.full_name,
            username: user.username,
            avatarUrl: user.avatarUrl
        })
        navigate('/messages')
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
            <div className='flex-grow flex flex-col h-screen pb-20 md:pb-0'>
                <div className='space-y-6 max-w-4xl px-4'>
                    {user ? (
                        <>
                            {/* Profile Header Card */}
                            <div className='bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden'>
                                {/* Cover Image */}
                                <div className="relative h-48 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                                    <div className="absolute inset-0 bg-[url('/patterns/pattern-1.svg')] opacity-30" />
                                </div>

                                <div className="px-8 pb-8">
                                    {/* Avatar & Actions Section */}
                                    <div className="relative -mt-24 mb-6 flex flex-col items-center sm:flex-row sm:items-end sm:justify-between gap-4">
                                        {/* Avatar */}
                                        <div className="relative z-10">
                                            <div className="relative inline-block">
                                                <div className="w-36 h-36 rounded-2xl border-4 border-white shadow-xl overflow-hidden">
                                                    <img
                                                        src={user?.avatarUrl}
                                                        alt={user?.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {authUser?._id === user?._id && (
                                                    <>
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            onChange={handleFileChange}
                                                            className="hidden"
                                                            accept="image/*"
                                                        />
                                                        <button
                                                            onClick={() => fileInputRef.current.click()}
                                                            className="absolute bottom-2 right-2 p-2 bg-white/90 backdrop-blur rounded-xl shadow-lg hover:bg-white transition-all group"
                                                        >
                                                            <ImagePlus className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto sm:self-end">
                                            {authUser?._id === user?._id ? (
                                                <UProfileDialog
                                                    props={user}
                                                    onSubmit={handleSubmit}
                                                    trigger={
                                                        <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 transition-all w-full sm:w-auto">
                                                            <PenSquare className="w-4 h-4" />
                                                            Edit Profile
                                                        </button>
                                                    }
                                                />
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={handleFollowToggle}
                                                        className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl transition-all w-full sm:w-auto ${isFollowing
                                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0'
                                                            }`}
                                                    >
                                                        {isFollowing ? (
                                                            <><UserMinus className="w-4 h-4" /> Unfollow</>
                                                        ) : (
                                                            <><UserPlus className="w-4 h-4" /> Follow</>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={handleMessageClick}
                                                        className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 transition-all w-full sm:w-auto"
                                                    >
                                                        <MessageCircle className="w-4 h-4" />
                                                        Message
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Info */}
                                    <div className="space-y-6">
                                        {/* Basic Info */}
                                        <div>
                                            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
                                                {user?.full_name}
                                            </h2>
                                            <p className="text-gray-500 flex items-center gap-2 mt-1">
                                                <Mail className="w-4 h-4" />
                                                @{user?.username}
                                            </p>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-2xl border border-gray-100 shadow-sm">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <div className="text-center p-4 rounded-xl bg-white hover:shadow-md transition-all cursor-pointer group">
                                                        <div className="flex flex-col items-center">
                                                            <Users className="w-6 h-6 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                                                            <div className="text-lg font-semibold text-gray-800">{followersCount}</div>
                                                            <div className="text-sm text-gray-500">Followers</div>
                                                        </div>
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80 p-0 rounded-xl shadow-lg" align="start">
                                                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                                                        <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                                                            <Users className="w-5 h-5 text-blue-500" />
                                                            Followers
                                                        </h4>
                                                        <p className="text-sm text-gray-500">People following {user?.username}</p>
                                                    </div>
                                                    <div className="max-h-[300px] overflow-y-auto">
                                                        {user?.followers?.length > 0 ? (
                                                            <div className="p-2">
                                                                {user.followers.map((follower) => (
                                                                    <div
                                                                        key={follower._id}
                                                                        className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                                                    >
                                                                        <img
                                                                            src={follower.avatarUrl}
                                                                            alt={follower.username}
                                                                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-100"
                                                                        />
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-medium text-gray-800 truncate">
                                                                                {follower.full_name}
                                                                            </p>
                                                                            <p className="text-sm text-gray-500 truncate">
                                                                                @{follower.username}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="p-6 text-center text-gray-500">
                                                                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                                                No followers yet
                                                            </div>
                                                        )}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>

                                            <div className="text-center p-4 rounded-xl bg-white hover:shadow-md transition-all group">
                                                <div className="flex flex-col items-center">
                                                    <Image className="w-6 h-6 text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                                                    <div className="text-lg font-semibold text-gray-800">{userPosts.length}</div>
                                                    <div className="text-sm text-gray-500">Posts</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Additional Info */}
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                                                <MapPin className="w-4 h-4 text-blue-500" />
                                                {user?.location ? (
                                                    <>
                                                        <img
                                                            src={getFlagImage(user.location)}
                                                            width="24"
                                                            alt={user.location}
                                                        />
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500">Not specified</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                                                <Cake className="w-4 h-4 text-pink-500" />
                                                <span>{user?.birthday ? extractTime(user.birthday) : 'Not specified'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                                                <User2 className="w-4 h-4 text-purple-500" />
                                                <span className="capitalize">{user?.gender === true ? 'Male' : user?.gender === false ? 'Female' : 'Not specified'}</span>
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl">
                                                <Calendar className="w-4 h-4 text-green-500" />
                                                <span>Joined 2024</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Posts Section */}
                            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50 backdrop-blur-sm">
                                    <h3 className="text-lg font-semibold flex items-center gap-2">
                                        <Image className="w-5 h-5 text-blue-600" />
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                            Posts & Photos
                                        </span>
                                    </h3>
                                </div>
                                <div className="p-8">
                                    {sortedUserPosts.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                                            <div className="w-24 h-24 mb-4 text-gray-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Posts Yet</h3>
                                            <p className="text-gray-500">This user hasn&apos;t shared any posts yet.</p>
                                        </div>
                                    ) : (
                                        <ListPost posts={sortedUserPosts} />
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <Error content='profile' />
                    )}
                </div>
            </div>

        </>
    );
}

export default Profile
