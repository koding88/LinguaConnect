import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
    User,
    Mail,
    Users,
    Calendar,
    MapPin,
    ArrowLeft
} from "lucide-react"
import useAccount from '@/zustand/useAccount'
import { useParams } from 'react-router-dom'

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
        <div className="min-h-screen bg-gray-50/50">
            <div className="flex flex-col items-center p-6 md:pt-10">
                <div className="flex items-center gap-2 mb-6">
                    <User className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Account Detail</h1>
                </div>

                <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg ring-1 ring-black/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Form Section */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Full Name</label>
                                </div>
                                <input
                                    type="text"
                                    value={account.full_name}
                                    disabled
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Email</label>
                                </div>
                                <input
                                    type="email"
                                    value={account.email}
                                    disabled
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Gender</label>
                                </div>
                                <input
                                    type="text"
                                    value={account.gender ? 'Male' : 'Female'}
                                    disabled
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Birthday</label>
                                </div>
                                <input
                                    type="text"
                                    value={new Date(account.birthday).toLocaleDateString('en-GB')}
                                    disabled
                                    className="w-full p-2 border rounded-md bg-gray-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <label className="text-sm font-medium">Location</label>
                                </div>
                                <input
                                    type="text"
                                    value={account.location}
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
                            <div className="w-48 h-48 rounded-full bg-gray-300 overflow-hidden shadow-md">
                                <img
                                    src={account.avatarUrl}
                                    alt="Profile"
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

export default AccountDetail
