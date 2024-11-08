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

const topics = [
    { id: 'topic-1', icon: '🗣️', title: 'Daily Routine Conversation' },
    { id: 'topic-2', icon: '🍽️', title: 'Restaurant Role-Play' },
    { id: 'topic-3', icon: '✈️', title: 'Travel Plans Discussion' },
    { id: 'topic-4', icon: '🎨', title: 'Art & Culture Discussion' },
    { id: 'topic-5', icon: '🎮', title: 'Gaming & Entertainment' },
    { id: 'topic-6', icon: '📚', title: 'Book Club Discussion' },
    { id: 'topic-7', icon: '🏋️', title: 'Fitness & Health' },
    { id: 'topic-8', icon: '🎵', title: 'Music & Concerts' },
    { id: 'topic-9', icon: '🌱', title: 'Environmental Issues' },
    { id: 'topic-10', icon: '👨‍💻', title: 'Technology Trends' },
    { id: 'topic-11', icon: '🍳', title: 'Cooking & Recipes' },
    { id: 'topic-12', icon: '🎭', title: 'Theater & Performance' },
    { id: 'topic-13', icon: '🌍', title: 'Current Events' },
    { id: 'topic-14', icon: '🎓', title: 'Education & Learning' },
    { id: 'topic-15', icon: '🏠', title: 'Home & Interior Design' },
    { id: 'topic-16', icon: '👔', title: 'Career Development' },
    { id: 'topic-17', icon: '🐾', title: 'Pets & Animals' },
    { id: 'topic-18', icon: '🎨', title: 'DIY & Crafts' },
    { id: 'topic-19', icon: '🌺', title: 'Gardening & Plants' },
    { id: 'topic-20', icon: '🎪', title: 'Events & Festivals' },
]

const TopicsSection = ({ markdown }) => {
    return (
        <div className="w-1/3 h-[400px] overflow-y-auto">
            <Accordion type="single" collapsible className="w-full">
                {topics.map((topic) => (
                    <AccordionItem key={topic.id} value={topic.id}>
                        <AccordionTrigger className="text-lg">
                            {topic.icon} {topic.title}
                        </AccordionTrigger>
                        <AccordionContent className="text-base">
                            <Markdown
                                remarkPlugins={[remarkGfm, remarkEmoji]}
                                rehypePlugins={[rehypeRaw, rehypeKatex, rehypeHighlight]}
                            >
                                {markdown}
                            </Markdown>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default TopicsSection
