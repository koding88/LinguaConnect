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
    const chatClassName = fromMe ? 'chat-end' : 'chat-start'
    const profilePic = fromMe ? authUser?.avatarUrl : selectedConversation?.avatarUrl
    const bubbleBgColor = fromMe ? "bg-blue-200" : "bg-gray-200";
    const shakeClass = message.shouldShake ? "shake" : "";
    const time = useMemo(() => extractTimeMessage(message.createdAt), [message.createdAt])

    const [selectedWord, setSelectedWord] = useState(null);
    const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

    const handleDoubleClick = useCallback(() => {
        const selection = window.getSelection();
        const word = selection.toString().trim();
        if (word) {
            const rect = selection.getRangeAt(0).getBoundingClientRect();
            const { innerHeight: viewportHeight, innerWidth: viewportWidth, scrollY } = window;

            let x = Math.max(0, Math.min(rect.left, viewportWidth - 300)); // Assuming popup width is 300px
            let y = rect.bottom + scrollY;

            // Adjust position if the popup would be out of the viewport
            if (y + 400 > viewportHeight + scrollY) { // Assuming popup height is 400px
                y = Math.max(0, rect.top + scrollY - 400);
            }

            setPopupPosition({ x, y });
            setSelectedWord(word);
        }
    }, []);

    const closePopup = useCallback(() => setSelectedWord(null), []);

    const handleGrammarCheck = () => {
        checkGrammar(message.message);
        toast.info(`Checking grammar: ${message.message}`);
    };

    const handleTranslate = () => {
        // Get country name from country code using countries.json
        const countryCode = authUser.location?.toLowerCase();
        const country = countries.find(c => c.code.toLowerCase() === countryCode)?.name || 'English';
        translateMessage(message.message, selectedConversation._id, country);
        toast.info(`Translating: ${message.message} to ${country}`);
    };

    const handleWritingTips = () => {
        getWritingTips(message.message, selectedConversation._id);
        toast.info(`Getting writing tips: ${message.message}`);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger onDoubleClick={handleDoubleClick}>
                <div className={`chat ${chatClassName} mb-4`}>
                    <div className="chat-image avatar">
                        <div className="w-10 rounded-full">
                            <img
                                alt="User avatar"
                                src={profilePic}
                                loading="lazy"
                            />
                        </div>
                    </div>
                    <div className={`chat-bubble ${bubbleBgColor} ${shakeClass} text-black`}>
                        {message.message}
                    </div>
                    <div className='chat-footer opacity-50 text-xs flex gap-1 items-center'>{time}</div>
                </div>
            </ContextMenuTrigger>

            {selectedWord && (
                <DictionaryPopup
                    word={selectedWord}
                    position={popupPosition}
                    onClose={closePopup}
                />
            )}

            <ContextMenuContent>
                <ContextMenuItem onClick={handleTranslate} disabled={translateLoading}>
                    <BsTranslate className="mr-2 text-blue-500" />
                    <span>{translateLoading ? "Translating..." : "AI Translate"}</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={handleWritingTips} disabled={writingTipsLoading}>
                    <FaRegLightbulb className="mr-2 text-yellow-500" />
                    <span>{writingTipsLoading ? "Loading..." : "AI Writing Tips"}</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={handleGrammarCheck} disabled={checkGrammarLoading}>
                    <TbTextGrammar className="mr-2 text-green-500" />
                    <span>{checkGrammarLoading ? "Checking..." : "AI Check Grammar"}</span>
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    )
}

export default React.memo(MessageItem)
