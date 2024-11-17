import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Filter, Heart, UserCheck, Clock, MessageCircle } from "lucide-react"

const filterOptions = [
    {
        id: 'for-you',
        label: 'For You',
        icon: <UserCheck className="w-5 h-5" />,
        gradient: 'from-blue-600 to-purple-600',
        action: 'getAllPosts'
    },
    {
        id: 'following',
        label: 'Following',
        icon: <Clock className="w-5 h-5" />,
        gradient: 'from-indigo-600 to-blue-600',
        action: 'filterPostByFollowing'
    },
    {
        id: 'liked',
        label: 'Liked',
        icon: <Heart className="w-5 h-5" />,
        gradient: 'from-pink-600 to-rose-600',
        action: 'filterPostByLikes'
    },
    {
        id: 'comments',
        label: 'Comments',
        icon: <MessageCircle className="w-5 h-5" />,
        gradient: 'from-green-600 to-emerald-600',
        action: 'filterPostByComments'
    }
]

const DialogFilter = ({ isOpen, onClose, onFilterChange, currentFilter }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] border-0 shadow-lg">
                <DialogHeader className="pb-4 border-b">
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <Filter className="w-5 h-5 text-blue-600" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Filter Posts
                        </span>
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 p-1">
                    {filterOptions.map((option) => (
                        <Button
                            key={option.id}
                            variant={currentFilter === option.id ? "default" : "outline"}
                            className={`w-full justify-start gap-3 p-6 text-base font-medium transition-all duration-200 ${
                                currentFilter === option.id 
                                    ? `bg-gradient-to-r ${option.gradient} text-white hover:opacity-90` 
                                    : 'hover:border-blue-200 hover:bg-blue-50'
                            }`}
                            onClick={() => {
                                onFilterChange(option.id);
                                onClose();
                            }}
                        >
                            <span className={`${currentFilter === option.id ? 'text-white' : 'text-gray-600'}`}>
                                {option.icon}
                            </span>
                            {option.label}
                        </Button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default DialogFilter 