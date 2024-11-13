import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
    Users, Type, FileText, User, UsersRound, Users2, ArrowLeft,
    Calendar, Shield, Settings2, Hash, UserCheck, UserPlus
} from "lucide-react"
import useGroup from '@/zustand/useGroup'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { extractTime } from '@/utils/extractTime';

const GroupDetailManage = () => {
    const { groupId } = useParams()
    const { getGroupDetail } = useGroup()
    const [groupDetail, setGroupDetail] = React.useState({
        name: '',
        description: '',
        owner: { username: '', avatarUrl: '' },
        members: [],
        maxMembers: 0,
        avatarUrl: '',
        createdAt: new Date(),
        status: 'active'
    })
    const navigate = useNavigate()

    React.useEffect(() => {
        const fetchGroupDetail = async () => {
            const detail = await getGroupDetail(groupId)
            setGroupDetail(detail)
        }
        fetchGroupDetail()
    }, [groupId, getGroupDetail])

    const InfoField = ({ icon: Icon, label, value, className = "" }) => (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow h-28">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <label className="text-sm font-medium text-gray-600">{label}</label>
            </div>
            <div className={`mt-1 text-gray-900 ${className}`}>
                {value}
            </div>
        </div>
    )

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-7xl mx-auto space-y-6"
            >
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                Group Details
                            </h1>
                            <p className="text-sm text-gray-500">Manage and view group information</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate(-1)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Groups
                    </Button>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left Column - Avatar and Basic Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center h-[240px]"
                        >
                            <div className="relative mx-auto w-32 h-32 mb-4">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
                                <img
                                    src={groupDetail?.avatarUrl}
                                    alt="Group"
                                    className="relative w-full h-full object-cover rounded-full border-4 border-white"
                                />
                                <div className="absolute bottom-0 right-0 p-1 bg-white rounded-full border border-gray-200">
                                    <Shield className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                            <h2 className="text-xl font-semibold mb-2">{groupDetail?.name}</h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
                        >
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Settings2 className="w-5 h-5 text-blue-600" />
                                Group Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                    <span className="text-green-700 font-medium">Active</span>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Created</span>
                                    <span className="text-gray-900">{extractTime(groupDetail?.createdAt)}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Detailed Info */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                            className="grid sm:grid-cols-2 gap-4"
                        >
                            <InfoField
                                icon={User}
                                label="Owner"
                                value={
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={groupDetail?.owner?.avatarUrl}
                                            alt={groupDetail?.owner?.username}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span>{groupDetail?.owner?.username}</span>
                                    </div>
                                }
                            />
                            {console.log(groupDetail)}
                            <InfoField
                                icon={Calendar}
                                label="Created At"
                                value={extractTime(groupDetail?.createdAt)}
                            />
                            <InfoField
                                icon={UserCheck}
                                label="Current Members"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-semibold text-blue-600">
                                            {groupDetail?.members?.length}
                                        </span>
                                        <span className="text-gray-500">members</span>
                                    </div>
                                }
                            />
                            <InfoField
                                icon={UserPlus}
                                label="Maximum Members"
                                value={
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-semibold text-purple-600">
                                            {groupDetail?.maxMembers}
                                        </span>
                                        <span className="text-gray-500">slots</span>
                                    </div>
                                }
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 overflow-y-auto h-[182px]"
                        >
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-600" />
                                Description
                            </h3>
                            <p className="text-gray-600 whitespace-pre-wrap">
                                {groupDetail?.description || 'No description provided.'}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default GroupDetailManage
