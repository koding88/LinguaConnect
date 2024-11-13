import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import MDEditor from '@uiw/react-md-editor'
import {
    MessageSquare,
    Type,
    FileText,
    ArrowLeft,
    Save,
    BookOpen,
    PencilLine
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-purple-50/50">
            <div className="flex flex-col items-center p-4 sm:p-6 md:pt-10 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col items-center gap-2 mb-8 text-center">
                    <div className="p-3 bg-green-100 rounded-full">
                        <PencilLine className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Update Topic
                    </h1>
                    <p className="text-gray-500 max-w-md text-sm md:text-base">
                        Modify and improve your topic content
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-3xl">
                    <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Type className="w-5 h-5 text-blue-500" />
                                <label className="text-sm font-semibold text-gray-700">Topic Name</label>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={handleNameChange}
                                    className="w-full p-3 pr-16 border rounded-lg focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    required
                                    maxLength={30}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                                    {name.length}/30
                                </span>
                            </div>
                        </div>

                        {/* Description Editor */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                                <label className="text-sm font-semibold text-gray-700">Description</label>
                            </div>
                            <div data-color-mode="light" className="rounded-lg overflow-hidden border">
                                <MDEditor
                                    value={description}
                                    onChange={setDescription}
                                    preview="live"
                                    height={285}
                                    className="w-full"
                                />
                            </div>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                {description.length}/5000 characters
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                className="w-full sm:w-auto order-2 sm:order-1"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200 order-1 sm:order-2"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Update Topic
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
