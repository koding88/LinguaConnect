import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/context/AuthContext'
import useGroupZ from '@/zustand/useGroupZ'
import WhatNew from '@/components/WhatNew'
import { CiCamera } from "react-icons/ci"
import PostGroupDialog from '@/components/group/dialog/PostGroupDiaglog'
import ListPost from '@/components/group/post/ListPost'
import Header from '@/components/group/header/Header'
import { toast } from 'react-toastify'

const GroupDetail = () => {
    const { groupId } = useParams()
    const navigate = useNavigate()
    const { authUser } = useAuthContext()
    const fileInputRef = React.useRef(null)
    const [isPostGroupDialogOpen, setIsPostGroupDialogOpen] = React.useState(false)

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
            await Promise.all([
                getGroup(groupId),
                getGroupPosts(groupId)
            ])
        }
        fetchGroupData()
    }, [getGroup, getGroupPosts, groupId])

    const handleAvatarUpload = async (file) => {
        try {
            const formData = new FormData()
            formData.append('files', file)
            await updateAvatarGroup(formData, groupId)
            await getGroup(groupId)
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating avatar")
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
        return group?.members?.slice(0, 5).map((member) => (
            <div className="avatar" key={member._id}>
                <div className="w-8">
                    <img src={member.avatarUrl} sizes='100px' alt={`${member.name}'s avatar`} />
                </div>
            </div>
        ))
    }

    const renderMemberCount = () => {
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

    return (
        <>
            <Header props={headerProps} />

            <div className="flex-grow flex flex-col h-screen">
                <div className='bg-white rounded-tl-[28px] rounded-tr-[28px] flex-1 border-[1px] border-[#D5D5D5] flex flex-col overflow-hidden'>
                    <div className="flex flex-col h-full p-4 overflow-y-auto">
                        <div className="border-b border-[#D5D5D5] p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 pr-4">
                                    <div className="text-black text-2xl font-semibold">{group?.name}</div>
                                    <div className="text-black text-sm font-normal mt-4">{group?.description}</div>
                                    <div className="list-members flex items-center mt-4">
                                        <div className="avatar-group -space-x-4 rtl:space-x-reverse">
                                            {renderMemberAvatars()}
                                            {group?.members?.length > 50 && (
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content w-8">
                                                        <span>+50</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className='text-black text-sm font-normal ml-4'>
                                            {renderMemberCount()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 relative">
                                    <img
                                        src={group?.avatarUrl}
                                        alt="Group thumbnail"
                                        className="w-28 h-28 rounded-full border-2 border-gray-300"
                                    />
                                    {isOwner && (
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
                        </div>

                        <div>
                            <WhatNew
                                avatarUrl={authUser?.avatarUrl}
                                handleOpenDialog={() => setIsPostGroupDialogOpen(true)}
                            />

                            <PostGroupDialog
                                isOpen={isPostGroupDialogOpen}
                                onClose={() => setIsPostGroupDialogOpen(false)}
                                user={authUser}
                                groupId={groupId}
                                onPostCreated={handlePostCreated}
                            />
                        </div>

                        <div className="mt-4">
                            <ListPost posts={groupPosts?.posts} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GroupDetail
