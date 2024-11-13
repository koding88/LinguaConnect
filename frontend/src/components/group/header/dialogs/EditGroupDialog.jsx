import React from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FiEdit3, FiType, FiAlignLeft } from 'react-icons/fi'

const EditGroupDialog = ({ isOpen, onClose, groupData, onSubmit }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        description: ''
    })

    React.useEffect(() => {
        if (isOpen && groupData) {
            setFormData({
                name: groupData.name,
                description: groupData.description
            })
        }
    }, [isOpen, groupData])

    const handleSubmit = async (e) => {
        e.preventDefault()
        await onSubmit(formData)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FiEdit3 className="w-5 h-5 text-purple-600" />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Edit Group Information
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Make changes to your group's information here.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium flex items-center gap-2 text-gray-700"
                            >
                                <FiType className="w-4 h-4 text-purple-500" />
                                Group Name
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                                className="rounded-xl border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                                placeholder="Enter group name"
                            />
                            <div className="text-xs text-right text-gray-400">
                                {formData.name.length}/30 characters
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-medium flex items-center gap-2 text-gray-700"
                            >
                                <FiAlignLeft className="w-4 h-4 text-purple-500" />
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                                className="rounded-xl min-h-[100px] border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                                placeholder="What's your group about?"
                            />
                            <div className="text-xs text-right text-gray-400">
                                {formData.description.length}/50 characters
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <div className="flex justify-end gap-2 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                className="rounded-xl border-gray-200 hover:bg-gray-50 px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6"
                            >
                                Save changes
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditGroupDialog
