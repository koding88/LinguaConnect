import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import React from "react"
import axiosClient from "@/api/axiosClient"

export const FavoriteTopics = ({ selectedTopics = [], toggleTopic, className = "h-[180px] sm:h-[200px]", otherClassName = "" }) => {
    const [topicsList, setTopicsList] = React.useState([]);
    const [error, setError] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        const fetchTopics = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axiosClient.get('/users/topics');
                if (response.data) {
                    const formattedTopics = response.data.data.map(topic => ({
                        value: topic._id,
                        label: topic.name,
                        description: topic.description
                    }));
                    setTopicsList(formattedTopics);
                }
            } catch (error) {
                console.error('Error fetching topics:', error);
                setError('Failed to load topics. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const handleTopicToggle = (topicValue) => {
        console.log('Toggling topic:', topicValue);
        console.log('Current selected topics:', selectedTopics);
        toggleTopic(topicValue);
    };

    const normalizedSelectedTopics = Array.isArray(selectedTopics) ? selectedTopics : [];

    return (
        <div className="grid gap-1.5">
            <Label className="text-xs sm:text-sm font-medium text-gray-700">Favorite Topics</Label>
            <Card className={`border rounded-md h-[400px] sm:h-[400px] ${otherClassName}`}>
                <ScrollArea className={`w-full rounded-md h-full ${className}`}>
                    <div className="p-3">
                        {loading && (
                            <div className="flex justify-center items-center h-32">
                                <div className="loading loading-spinner"></div>
                            </div>
                        )}
                        {error && (
                            <div className="text-red-500 text-center p-4">
                                {error}
                            </div>
                        )}
                        {!loading && !error && topicsList.length === 0 && (
                            <div className="flex justify-center items-center h-32 text-gray-500">
                                No topics available
                            </div>
                        )}
                        {!loading && !error && topicsList.length > 0 && (
                            <div className="grid grid-cols-2 gap-2">
                                {topicsList.map((topic) => (
                                    <div key={topic.value}
                                        className={`flex items-center space-x-2 p-2 rounded transition-all w-full
                                                    ${normalizedSelectedTopics.includes(topic.value)
                                                ? 'bg-blue-50'
                                                : 'hover:bg-gray-50'}`}
                                    >
                                        <Checkbox
                                            id={topic.value}
                                            checked={normalizedSelectedTopics.includes(topic.value)}
                                            onCheckedChange={() => handleTopicToggle(topic.value)}
                                            className={normalizedSelectedTopics.includes(topic.value)
                                                ? 'border-blue-500 data-[state=checked]:bg-blue-500'
                                                : ''}
                                        />
                                        <Label
                                            htmlFor={topic.value}
                                            className="cursor-pointer text-sm flex-1"
                                            title={topic.description}
                                        >
                                            {topic.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    )
}
