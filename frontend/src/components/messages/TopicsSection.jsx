import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import remarkEmoji from 'remark-emoji'
import rehypeHighlight from 'rehype-highlight'
import axiosClient from '@/api/axiosClient'

const TopicsSection = ({ authUser }) => {
    const [topics, setTopics] = React.useState([]);
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
                        id: topic._id,
                        title: topic.name,
                        description: topic.description,
                    }));
                    setTopics(formattedTopics);
                }
            } catch (err) {
                console.error('Error fetching topics:', err);
                setError('Failed to load topics. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const favoriteTopics = topics.filter(topic =>
        authUser?.favoriteTopics?.includes(topic.id)
    );

    const otherTopics = topics.filter(topic =>
        !authUser?.favoriteTopics?.includes(topic.id)
    );

    const TopicList = ({ topics, title, className }) => (
        <div className={`rounded-lg p-2 sm:p-4 mb-2 sm:mb-4 shadow-sm ${className}`}>
            <h3 className="text-base font-bold mb-2 bg-white/95 backdrop-blur-sm p-1 rounded-md z-10 sm:text-xl sm:mb-3 sm:p-2">
                {title}
            </h3>
            <Accordion type="single" collapsible className="w-full">
                {topics.length > 0 ? (
                    topics.map((topic) => (
                        <AccordionItem
                            key={topic.id}
                            value={topic.id}
                            className="border border-gray-100 rounded-lg mb-1 hover:border-blue-200 transition-colors sm:mb-2"
                        >
                            <AccordionTrigger className="text-sm hover:text-blue-600 sticky top-12 bg-white/95 backdrop-blur-sm p-2 rounded-t-lg z-10 font-medium sm:text-lg sm:p-3">
                                {topic.title}
                            </AccordionTrigger>
                            <AccordionContent className="text-xs max-h-[200px] overflow-y-auto p-2 bg-white/50 sm:text-base sm:max-h-[300px] sm:p-4">
                                <Markdown
                                    remarkPlugins={[remarkGfm, remarkEmoji]}
                                    rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
                                    className="prose prose-xs max-w-none prose-headings:text-blue-600 prose-a:text-blue-500 sm:prose-sm"
                                >
                                    {topic.description}
                                </Markdown>
                            </AccordionContent>
                        </AccordionItem>
                    ))
                ) : (
                    <p className="text-gray-500 italic text-center py-2 text-sm sm:py-4">No topics available.</p>
                )}
            </Accordion>
        </div>
    );

    return (
        <div className="w-full h-[calc(100vh-600px)] sm:w-1/3 sm:h-[400px] overflow-y-auto px-1 sm:px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {loading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="text-red-500 text-center p-2 sm:p-4 bg-red-50 rounded-lg text-sm">
                    {error}
                </div>
            ) : (
                <>
                    <TopicList
                        topics={favoriteTopics}
                        title="Favorite Topics"
                        className="border border-blue-200 bg-blue-50/30 sm:border-2 mt-8 sm:mt-0"
                    />
                    <TopicList
                        topics={otherTopics}
                        title="All Topics"
                        className="bg-gray-50/70"
                    />
                </>
            )}
        </div>
    )
}

export default TopicsSection
