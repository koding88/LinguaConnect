import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import MDEditor from '@uiw/react-md-editor'
import {
    MessageSquare,
    Type,
    FileText,
    ArrowLeft
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
        <div className="min-h-screen bg-gray-50/50">
            <div className="flex flex-col items-center p-6 md:pt-10">
                <div className="flex items-center gap-2 mb-6">
                    <MessageSquare className="w-6 h-6" />
                    <h1 className="text-2xl font-bold">Topic Detail</h1>
                </div>

                <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-sm">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Type className="w-4 h-4 text-gray-500" />
                                <label className="text-sm font-medium">Name</label>
                            </div>
                            <input
                                type="text"
                                value={topic.name}
                                className="w-full p-2 border rounded-md bg-gray-50"
                                disabled
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <label className="text-sm font-medium">Description</label>
                            </div>
                            <MDEditor
                                value={topic.description}
                                preview="preview"
                                hideToolbar
                                height={285}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="bg-black text-white"
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
