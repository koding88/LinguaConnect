import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import useGroupZ from '@/zustand/useGroupZ'
import WhatNew from '@/components/WhatNew'
import { CiCamera } from "react-icons/ci"
import { FiUsers, FiInfo } from "react-icons/fi"
import { TfiCrown } from "react-icons/tfi";
import PostGroupDialog from '@/components/group/dialog/PostGroupDiaglog'
import ListPost from '@/components/group/post/ListPost'
import Header from '@/components/group/header/Header'
import { toast } from 'react-toastify'
import { Skeleton } from '@/components/ui/skeleton'

const GroupDetail = () => {
    const { groupId } = useParams()
    const navigate = useNavigate()
    const { authUser } = useAuthContext()
    const fileInputRef = React.useRef(null)
    const [isPostGroupDialogOpen, setIsPostGroupDialogOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)
    const [error, setError] = React.useState(false)

    const {
        getGroup,
        group,
        getGroupPosts,
        groupPosts,
        leaveGroup,
        editGroup,
        removeMember,
        updateMaxMembers,
        deleteGroup,
        updateAvatarGroup
    } = useGroupZ()

    const isOwner = group?.owner._id === authUser?._id

    React.useEffect(() => {
        const fetchGroupData = async () => {
            setIsLoading(true)
            try {
                const [groupResponse, postsResponse] = await Promise.all([
                    getGroup(groupId),
                    getGroupPosts(groupId)
                ])
                if (groupResponse && postsResponse) {
                    setError(false)
                } else {
                    setError(true)
                }
            } catch {
                setError(true)
            } finally {
                setIsLoading(false)
            }
        }
        fetchGroupData()
    }, [getGroup, getGroupPosts, groupId])

    const handleAvatarUpload = async (file) => {
        try {
            const formData = new FormData()
            formData.append('files', file)
            await updateAvatarGroup(formData, groupId)
            await getGroup(groupId)
        } catch (err) {
            toast.error(err.response?.data?.message || "Error updating avatar")
        }
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            handleAvatarUpload(file)
        }
    }

    const handlePostCreated = async () => {
        await getGroupPosts(groupId)
        setIsPostGroupDialogOpen(false)
    }

    const handleLeaveGroup = () => {
        leaveGroup(groupId)
        navigate('/')
    }

    const handleEditGroup = async (formData) => {
        await editGroup(groupId, formData.name, formData.description)
        await getGroup(groupId)
    }

    const handleRemoveMember = (memberId) => {
        removeMember(groupId, memberId)
    }

    const handleUpdateMaxMembers = (newValue) => {
        updateMaxMembers(groupId, newValue)
    }

    const handleDeleteGroup = () => {
        deleteGroup(groupId)
        navigate('/')
    }

    const renderMemberAvatars = () => {
        if (isLoading) {
            return Array(5).fill(0).map((_, i) => (
                <div className="avatar" key={i}>
                    <Skeleton className="w-8 h-8 rounded-full" />
                </div>
            ))
        }

        return group?.members?.slice(0, 5).map((member) => (
            <div className="avatar" key={member._id}>
                <div className="w-8">
                    <img src={member.avatarUrl} sizes='100px' alt={`${member.name}'s avatar`} />
                </div>
            </div>
        ))
    }

    const renderMemberCount = () => {
        if (isLoading) {
            return <Skeleton className="h-4 w-24" />
        }

        return isOwner ? (
            <span>Members: {group?.members?.length} / {group?.maxMembers}</span>
        ) : (
            <span>{group?.members?.length} Members</span>
        )
    }

    const headerProps = {
        path: '/groups',
        title: 'Group Detail',
        isAdmin: isOwner,
        handleLeaveGroup,
        handleEditGroup,
        groupData: group,
        handleRemoveMember,
        handleUpdateMaxMembers,
        handleDeleteGroup
    }

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Header props={headerProps} />
                <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
                    <div className="relative">
                        <Skeleton className="h-36" />
                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-36">
                            <Skeleton className="w-24 h-24 rounded-2xl" />
                        </div>
                        <div className="pt-16 px-6 pb-6">
                            <div className="text-center mb-6">
                                <Skeleton className="h-8 w-48 mx-auto mb-2" />
                                <Skeleton className="h-6 w-32 mx-auto" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <Skeleton className="h-24 rounded-xl" />
                                <Skeleton className="h-24 rounded-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                        <div className="p-4">
                            <Skeleton className="h-16 rounded-xl" />
                        </div>
                        <div className="p-4">
                            <div className="space-y-4">
                                {Array(3).fill(0).map((_, i) => (
                                    <Skeleton key={i} className="h-32 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    console.log(`error: ${error}`)

    return (
        <>
            <div className="space-y-6">

                <Header props={headerProps} />
                <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
                    <div className="relative">
                        <div className={`h-36 ${isOwner
                            ? "bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-200 via-purple-200 to-blue-200"
                            : "bg-gradient-to-r from-blue-100 to-purple-100"
                            }`} />

                        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-36">
                            <div className="relative">
                                <div className={`w-24 h-24 rounded-2xl overflow-hidden ${isOwner
                                    ? "border-4 border-white ring-2 ring-purple-400 shadow-lg shadow-purple-200/50"
                                    : "border-4 border-white shadow-lg"
                                    } bg-white`}>
                                    <img
                                        src={group?.avatarUrl}
                                        alt="Group thumbnail"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                {isOwner && (
                                    <>
                                        <div className="absolute -top-3 -right-3 bg-yellow-400 p-1.5 rounded-full shadow-lg">
                                            <TfiCrown className="w-4 h-4 text-white" />
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                        <button
                                            onClick={() => fileInputRef.current.click()}
                                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 p-2 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-gray-100"
                                        >
                                            <CiCamera className="w-5 h-5 text-gray-600" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className={`pt-16 px-6 pb-6 ${isOwner
                            ? "bg-gradient-to-b from-purple-50/50 to-transparent"
                            : "bg-gradient-to-r from-blue-50/50 to-purple-50/50"
                            }`}>
                            <div className="text-center mb-6">
                                <h1 className={`text-2xl font-bold ${isOwner
                                    ? "bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                                    : "text-gray-900"
                                    }`}>
                                    {group?.name}
                                </h1>
                                {isOwner && (
                                    <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 text-sm font-medium">
                                        <TfiCrown className="w-3 h-3" />
                                        Group Owner
                                    </div>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl shadow-sm space-y-3 ${isOwner
                                    ? "bg-white/90 border border-purple-100"
                                    : "bg-white/80"
                                    }`}>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FiUsers className="h-4 w-4 flex-shrink-0" />
                                        <span className="text-sm font-medium">
                                            {renderMemberCount()}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                                            {renderMemberAvatars()}
                                            {group?.members?.length > 5 && (
                                                <div className="avatar placeholder">
                                                    <div className={`w-8 h-8 text-white text-xs flex items-center justify-center rounded-full ${isOwner
                                                        ? "bg-gradient-to-r from-purple-500 to-blue-500"
                                                        : "bg-gradient-to-r from-blue-500 to-purple-500"
                                                        }`}>
                                                        +{group.members.length - 5}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className={`flex flex-col gap-2 p-4 rounded-xl shadow-sm ${isOwner
                                    ? "bg-white/90 border border-purple-100"
                                    : "bg-white/80"
                                    }`}>
                                    <div className="text-sm font-medium text-gray-700">Description</div>
                                    <div className="flex items-start gap-2 text-gray-600">
                                        <FiInfo className="h-4 w-4 mt-1 flex-shrink-0" />
                                        <p className="text-sm">{group?.description || "No description"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={`divide-y divide-gray-100 ${isOwner ? "bg-gradient-to-b from-white to-purple-50/20" : ""
                        }`}>
                        <div className="p-4">
                            <WhatNew
                                avatarUrl={authUser?.avatarUrl}
                                handleOpenDialog={() => setIsPostGroupDialogOpen(true)}
                            />
                        </div>

                        <div className="p-4">
                            <div className="space-y-4">
                                <ListPost posts={groupPosts?.posts} />
                            </div>
                        </div>
                    </div>
                </div>

                <PostGroupDialog
                    isOpen={isPostGroupDialogOpen}
                    onClose={() => setIsPostGroupDialogOpen(false)}
                    user={authUser}
                    groupId={groupId}
                    onPostCreated={handlePostCreated}
                />
            </div>
        </>
    )
}

export default GroupDetail
