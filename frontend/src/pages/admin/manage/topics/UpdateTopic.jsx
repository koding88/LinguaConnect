import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import MDEditor from '@uiw/react-md-editor'
import {
    MessageSquare,
    Type,
    FileText,
    ArrowLeft,
    Save
} from "lucide-react"
import useTopic from '@/zustand/useTopic'
import { toast } from 'react-toastify'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const UpdateTopic = () => {
    const navigate = useNavigate()
    const { topicId } = useParams()
    const location = useLocation()
    const { updateTopic, getTopicByIdManage } = useTopic()
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [originalName, setOriginalName] = useState('')
    const [originalDescription, setOriginalDescription] = useState('')
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        const loadTopic = async () => {
            const topic = location.state?.topic || await getTopicByIdManage(topicId)
            if (topic) {
                setName(topic.name)
                setDescription(topic.description)
                setOriginalName(topic.name)
                setOriginalDescription(topic.description)
            }
        }
        loadTopic()
    }, [topicId, location.state, getTopicByIdManage])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!description?.trim()) {
            toast.error('Please enter topic description')
            return
        }
        if (name.length > 30) {
            toast.error('Topic name cannot exceed 30 characters')
            return
        }
        if (description.length > 5000) {
            toast.error('Topic description cannot exceed 5000 characters')
            return
        }

        const success = await updateTopic(topicId, { name, description })
        if (success) navigate('/admin/manage/topics')
    }

    const handleCancel = () => {
        if (name !== originalName || description !== originalDescription) {
            setShowAlert(true)
        } else {
            navigate('/admin/manage/topics')
        }
    }

    const handleNameChange = (e) => {
        const value = e.target.value
        if (value.length > 30) {
            toast.error('Topic name cannot exceed 30 characters')
            return
        }
        setName(value)
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="flex flex-col items-center p-6 md:pt-10">
                <div className="flex items-center gap-2 mb-6">
                    <MessageSquare className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Update Topic</h1>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-sm">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Type className="w-4 h-4 text-gray-500" />
                                <label className="text-sm font-medium">Name</label>
                            </div>
                            <input
                                type="text"
                                value={name}
                                onChange={handleNameChange}
                                className="w-full p-2 border rounded-md"
                                required
                                maxLength={30}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <label className="text-sm font-medium">Description</label>
                            </div>
                            <MDEditor
                                value={description}
                                onChange={setDescription}
                                preview="live"
                                height={285}
                            />
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-black text-white">
                                <Save className="w-4 h-4 mr-2" />
                                Update
                            </Button>
                        </div>
                    </div>
                </form>
            </div>

            <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to leave?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes. Your changes will be lost if you leave.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => navigate('/admin/manage/topics')}>
                            Leave
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default UpdateTopic
