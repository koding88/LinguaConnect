import React from 'react'
import { Button } from '@/components/ui/button'
import { FiSearch, FiUsers, FiUserMinus } from 'react-icons/fi'
import { TfiCrown } from "react-icons/tfi";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from 'react-toastify'

const ManageMembersDialog = ({ isOpen, onClose, groupData, onUpdateMaxMembers, onRemoveMember }) => {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [maxMembersInput, setMaxMembersInput] = React.useState(groupData?.maxMembers || 100)
    const [isSliding, setIsSliding] = React.useState(false)
    const slideTimeoutRef = React.useRef(null)

    React.useEffect(() => {
        if (groupData?.maxMembers) {
            setMaxMembersInput(groupData.maxMembers)
        }
    }, [groupData?.maxMembers])

    const handleSliderChange = (value) => {
        const newValue = value[0]
        const currentMembers = groupData?.members?.length || 0

        if (newValue < currentMembers) {
            toast.error(`Cannot set max members below current member count (${currentMembers})`)
            setMaxMembersInput(currentMembers)
            return
        }

        setMaxMembersInput(newValue)
        setIsSliding(true)

        if (slideTimeoutRef.current) {
            clearTimeout(slideTimeoutRef.current)
        }

        slideTimeoutRef.current = setTimeout(() => {
            onUpdateMaxMembers(newValue)
            setIsSliding(false)
        }, 1000)
    }

    React.useEffect(() => {
        return () => {
            if (slideTimeoutRef.current) {
                clearTimeout(slideTimeoutRef.current)
            }
        }
    }, [])

    const filteredMembers = groupData?.members?.filter((member) =>
        member?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FiUsers className="w-5 h-5 text-purple-600" />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Manage Members
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Search Input */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search members..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 rounded-xl border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                        />
                    </div>

                    {/* Member Limit Slider */}
                    <div className="space-y-2 bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Member Limit</span>
                            <span className="text-sm text-purple-600 font-medium">
                                {maxMembersInput} / 100
                            </span>
                        </div>
                        <Slider
                            max={100}
                            min={0}
                            step={1}
                            value={[maxMembersInput]}
                            onValueChange={handleSliderChange}
                            disabled={isSliding}
                            className="py-4"
                        />
                        <div className="text-xs text-gray-500">
                            Current members: {groupData?.members?.length || 0}
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                        {(searchTerm ? filteredMembers : groupData?.members || []).map((member) => (
                            <div
                                key={member._id}
                                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 rounded-xl ring-2 ring-purple-100">
                                        <AvatarImage src={member?.avatarUrl} alt={member?.name} />
                                        <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100">
                                            {member?.name?.slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-gray-700">{member?.full_name}</div>
                                        <div className="text-xs text-gray-500">@{member?.username}</div>
                                    </div>
                                </div>
                                {member?._id === groupData?.owner?._id ? (
                                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-600 text-sm">
                                        <TfiCrown className="w-3 h-3" />
                                        <span>Owner</span>
                                    </div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemoveMember(member?._id)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
                                    >
                                        <FiUserMinus className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ManageMembersDialog
