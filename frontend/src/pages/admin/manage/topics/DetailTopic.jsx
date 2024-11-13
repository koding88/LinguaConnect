import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import MDEditor from '@uiw/react-md-editor'
import {
    MessageSquare,
    Type,
    FileText,
    ArrowLeft,
    BookOpen,
    Eye
} from "lucide-react"
import useTopic from '@/zustand/useTopic'

const DetailTopic = () => {
    const { getTopicByIdManage } = useTopic()
    const navigate = useNavigate()
    const { topicId } = useParams()
    const [topic, setTopic] = useState({
        name: '',
        description: ''
    })

    useEffect(() => {
        const loadTopic = async () => {
            const topicData = await getTopicByIdManage(topicId)
            if (topicData) {
                setTopic(topicData)
            }
        }
        loadTopic()
    }, [topicId, getTopicByIdManage])

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50/50 to-purple-50/50">
            <div className="flex flex-col items-center p-4 sm:p-6 md:pt-10 max-w-7xl mx-auto">
                <div className="flex flex-col items-center gap-2 mb-8 text-center">
                    <div className="p-3 bg-purple-100 rounded-full">
                        <Eye className="w-8 h-8 text-purple-600" />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Topic Details
                    </h1>
                    <p className="text-gray-500 max-w-md text-sm md:text-base">
                        View detailed information about this topic
                    </p>
                </div>

                <div className="w-full max-w-3xl space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2">
                                <Type className="w-5 h-5 text-blue-500" />
                                <label className="text-sm font-semibold text-gray-700">Topic Name</label>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-gray-700">{topic.name}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-blue-500" />
                                <label className="text-sm font-semibold text-gray-700">Description</label>
                            </div>
                            <div data-color-mode="light" className="rounded-lg overflow-hidden border">
                                <MDEditor
                                    value={topic.description}
                                    preview="preview"
                                    hideToolbar
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-6">
                            <Button
                                onClick={() => navigate(-1)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailTopic
