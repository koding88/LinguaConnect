import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
    Users,
    Type,
    FileText,
    User,
    UsersRound,
    Users2,
    ArrowLeft
} from "lucide-react"
import useGroup from '@/zustand/useGroup'
import { useParams } from 'react-router-dom'

const GroupDetailManage = () => {
    const { groupId } = useParams()
    const { getGroupDetail } = useGroup()
    const [groupDetail, setGroupDetail] = React.useState({
        name: '',
        description: '',
        owner: { username: '' },
        members: [],
        maxMembers: 0,
        avatarUrl: ''
    })
    const navigate = useNavigate()

    React.useEffect(() => {
        const fetchGroupDetail = async () => {
            const detail = await getGroupDetail(groupId)
            setGroupDetail(detail)
        }
        fetchGroupDetail()
    }, [groupId, getGroupDetail])

    return (
        <div className="h-screen bg-gray-50/50 overflow-hidden">
            <div className="flex flex-col items-center p-6 md:pt-10 h-full overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                    <Users className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Group Detail</h1>
                </div>

                <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg ring-1 ring-black/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Form Section */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Type className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Name</label>
                                </div>
                                <input
                                    type="text"
                                    value={groupDetail?.name}
                                    disabled
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Description</label>
                                </div>
                                <textarea
                                    value={groupDetail?.description}
                                    disabled
                                    rows={4}
                                    className="w-full p-2 border rounded-md bg-gray-50 resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Owner</label>
                                </div>
                                <input
                                    type="text"
                                    value={groupDetail?.owner?.username}
                                    disabled
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <UsersRound className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Members</label>
                                </div>
                                <input
                                    type="number"
                                    value={groupDetail?.members?.length}
                                    disabled
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Users2 className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Max Members</label>
                                </div>
                                <input
                                    type="number"
                                    value={groupDetail?.maxMembers}
                                    disabled
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                />
                            </div>

                            <Button
                                onClick={() => navigate(-1)}
                                className="mt-6 bg-black text-white"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </div>

                        {/* Avatar Section */}
                        <div className="flex justify-center items-start">
                            <div className="w-48 h-48 rounded-full bg-gray-300 overflow-hidden">
                                <img
                                    src={groupDetail?.avatarUrl}
                                    alt="Group"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GroupDetailManage
