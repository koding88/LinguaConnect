import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
    User,
    Mail,
    Users,
    Calendar,
    MapPin,
    ArrowLeft,
    Shield,
    UserCircle
} from "lucide-react"
import useAccount from '@/zustand/useAccount'
import { useParams } from 'react-router-dom'
import { getFlagImage } from '@/utils/flag'

const AccountDetail = () => {
    const { getAccountById } = useAccount()
    const { userId } = useParams()
    const navigate = useNavigate()
    const [account, setAccount] = React.useState({
        full_name: '',
        email: '',
        gender: null,
        birthday: '',
        location: '',
        avatarUrl: ''
    })

    React.useEffect(() => {
        const fetchAccountDetail = async () => {
            const detail = await getAccountById(userId)
            setAccount(detail)
        }
        fetchAccountDetail()
    }, [userId, getAccountById])

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-purple-50/50">
            <div className="container mx-auto px-4 py-8 space-y-6">
                <div className="flex flex-col items-center mb-8 animate-fadeIn">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Account Detail
                        </h1>
                    </div>
                    <p className="text-gray-600">User information and details</p>
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden
                    transition-all hover:shadow-2xl border border-gradient-to-r from-blue-100 to-purple-100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
                        <div className="lg:col-span-1 flex flex-col items-center justify-start p-4 animate-float-slow">
                            <div className="relative group">
                                <div className="w-48 h-48 rounded-full overflow-hidden
                                    ring-4 ring-gradient-to-r from-blue-200 to-purple-200
                                    transition-transform hover:scale-105">
                                    {account?.avatarUrl ? (
                                        <img
                                            src={account?.avatarUrl}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-blue-50 to-purple-50
                                            flex items-center justify-center">
                                            <UserCircle className="w-24 h-24 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <h2 className="mt-4 text-xl font-semibold bg-clip-text text-transparent
                                bg-gradient-to-r from-blue-600 to-purple-600">
                                {account?.full_name}
                            </h2>
                            <p className="text-gray-500">{account?.email}</p>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 group">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <User className="w-5 h-5 text-blue-600 group-hover:text-purple-600 transition-colors" />
                                        <label className="font-medium">Full Name</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={account?.full_name}
                                        disabled
                                        className="w-full p-3 border rounded-lg bg-gradient-to-r from-blue-50/30 to-purple-50/30
                                            focus:ring-2 focus:ring-blue-200 transition-all"
                                    />
                                </div>

                                <div className="space-y-2 group">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Mail className="w-5 h-5 text-blue-600 group-hover:text-purple-600 transition-colors" />
                                        <label className="font-medium">Email</label>
                                    </div>
                                    <input
                                        type="email"
                                        value={account?.email}
                                        disabled
                                        className="w-full p-3 border rounded-lg bg-gradient-to-r from-blue-50/30 to-purple-50/30
                                            focus:ring-2 focus:ring-blue-200 transition-all"
                                    />
                                </div>

                                <div className="space-y-2 group">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Users className="w-5 h-5 text-blue-600 group-hover:text-purple-600 transition-colors" />
                                        <label className="font-medium">Gender</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={account?.gender ? 'Male' : 'Female'}
                                        disabled
                                        className="w-full p-3 border rounded-lg bg-gradient-to-r from-blue-50/30 to-purple-50/30
                                            focus:ring-2 focus:ring-blue-200 transition-all"
                                    />
                                </div>

                                <div className="space-y-2 group">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Calendar className="w-5 h-5 text-blue-600 group-hover:text-purple-600 transition-colors" />
                                        <label className="font-medium">Birthday</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={account?.birthday ? new Date(account?.birthday).toLocaleDateString('en-GB') : ''}
                                        disabled
                                        className="w-full p-3 border rounded-lg bg-gradient-to-r from-blue-50/30 to-purple-50/30
                                            focus:ring-2 focus:ring-blue-200 transition-all"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2 group">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin className="w-5 h-5 text-blue-600 group-hover:text-purple-600 transition-colors" />
                                        <label className="font-medium">Location</label>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-gradient-to-r from-blue-50/30 to-purple-50/30">
                                        {account?.location ? (
                                            <>
                                                <img
                                                    src={getFlagImage(account?.location)}
                                                    alt={account?.location}
                                                    className="w-6 h-6 rounded object-cover"
                                                />
                                            </>
                                        ) : (
                                            <span className="text-gray-500">Not specified</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={() => navigate(-1)}
                                className="w-full md:w-auto mt-8 bg-gradient-to-r from-blue-600 to-purple-600
                                    text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to List
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountDetail
