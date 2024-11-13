import React from 'react'
import { useState, useCallback, useMemo } from 'react'
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@/components/ui/context-menu'
import { BsTranslate } from 'react-icons/bs'
import { FaRegLightbulb } from 'react-icons/fa'
import { TbTextGrammar } from 'react-icons/tb'
import { useAuthContext } from '@/context/AuthContext'
import useConversationZ from '@/zustand/useConversationZ'
import { extractTimeMessage } from '@/utils/extractTime'
import DictionaryPopup from './dictionary/DictionaryPopup'
import useCheckGrammar from '@/hooks/useCheckGrammar'
import useTranslateMessage from '@/hooks/useTranslateMessage'
import useWritingTips from '@/hooks/useWritingTips'
import { toast } from 'react-toastify'
import countries from '@/utils/countries.json'

const MessageItem = ({ message }) => {
    const { authUser } = useAuthContext()
    const { selectedConversation } = useConversationZ()
    const { checkGrammar, loading: checkGrammarLoading } = useCheckGrammar();
    const { translateMessage, loading: translateLoading } = useTranslateMessage();
    const { getWritingTips, loading: writingTipsLoading } = useWritingTips();
    const fromMe = useMemo(() => message.senderId === authUser._id, [message.senderId, authUser._id])
    const time = useMemo(() => extractTimeMessage(message.createdAt), [message.createdAt])

    const [selectedWord, setSelectedWord] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

    const handleDoubleClick = useCallback(() => {
        const selection = window.getSelection();
        const word = selection.toString().trim();
        if (word) {
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            setPopupPosition({
                x: Math.min(rect.left, window.innerWidth - 350),
                y: Math.min(rect.bottom + window.scrollY, window.innerHeight - 400)
            });
            setSelectedWord(word);
        }
    }, []);

    const closePopup = useCallback(() => setSelectedWord(null), []);

    const handleGrammarCheck = () => {
        checkGrammar(message.message);
        toast.info(`Checking grammar: ${message.message}`);
    };

    const handleTranslate = () => {
        const countryCode = authUser.location?.toLowerCase();
        const country = countries.find(c => c.code.toLowerCase() === countryCode)?.name || 'English';
        translateMessage(message.message, selectedConversation._id, country);
        toast.info(`Translating: ${message.message} to ${country}`);
    };

    const handleWritingTips = () => {
        getWritingTips(message.message, selectedConversation._id);
        toast.info(`Getting writing tips: ${message.message}`);
    };

    const chatClassName = fromMe ? 'chat-end' : 'chat-start';
    const bubbleClassName = fromMe
        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800';

    return (
        <ContextMenu>
            <ContextMenuTrigger onDoubleClick={handleDoubleClick}>
                <div className={`chat ${chatClassName}`}>
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full ring-2 ring-white shadow-lg">
                            <img
                                alt="User avatar"
                                src={fromMe ? authUser?.avatarUrl : selectedConversation?.avatarUrl}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className={`chat-bubble ${bubbleClassName} shadow-md backdrop-blur-sm`}>
                        {message.message}
                    </div>
                    <div className="chat-footer opacity-75 text-xs flex gap-1 items-center">
                        {time}
                    </div>
                </div>
            </ContextMenuTrigger>

            {selectedWord && (
                <DictionaryPopup
                    word={selectedWord}
                    position={popupPosition}
                    onClose={closePopup}
                />
            )}

            <ContextMenuContent className="bg-white/95 backdrop-blur-sm border border-gray-100 shadow-xl rounded-xl p-2">
                <ContextMenuItem
                    onClick={handleTranslate}
                    disabled={translateLoading}
                    className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    <BsTranslate className="text-blue-500 w-4 h-4" />
                    <span>{translateLoading ? "Translating..." : "AI Translate"}</span>
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={handleWritingTips}
                    disabled={writingTipsLoading}
                    className="flex items-center gap-2 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                >
                    <FaRegLightbulb className="text-yellow-500 w-4 h-4" />
                    <span>{writingTipsLoading ? "Loading..." : "AI Writing Tips"}</span>
                </ContextMenuItem>
                <ContextMenuItem
                    onClick={handleGrammarCheck}
                    disabled={checkGrammarLoading}
                    className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-lg transition-colors"
                >
                    <TbTextGrammar className="text-green-500 w-4 h-4" />
                    <span>{checkGrammarLoading ? "Checking..." : "AI Check Grammar"}</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default MessageItem
