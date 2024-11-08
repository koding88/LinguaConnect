import React from 'react'
import { Button } from '@/components/ui/button'
import { X } from "lucide-react"
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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Manage Members</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <Input
                        placeholder="Search members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="maxMembers" className="text-right">
                            Member Limit: {maxMembersInput} (Current: {groupData?.members?.length || 0})
                        </label>
                        <Slider
                            max={100}
                            min={0}
                            step={1}
                            value={[maxMembersInput]}
                            onValueChange={handleSliderChange}
                            disabled={isSliding}
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto">
                        {(searchTerm ? filteredMembers : groupData?.members || []).map((member) => (
                            <div key={member._id} className="flex items-center justify-between p-2 hover:bg-accent">
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={member?.avatarUrl} alt={member?.name} />
                                        <AvatarFallback>{member?.name?.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                    <span>{member?.full_name}</span>
                                </div>
                                {member?._id === groupData?.owner?._id ? (
                                    <div className="text-sm text-muted-foreground">Owner</div>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onRemoveMember(member?._id)}
                                    >
                                        <X className="h-4 w-4" />
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
