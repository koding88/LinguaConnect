import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Alert from '@/components/alert/Alert';
import { IoSend } from "react-icons/io5";
import { FaRegCommentDots } from "react-icons/fa6";
import { RiEmotionHappyLine } from "react-icons/ri";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const CommentDialog = ({ isOpen, onOpenChange, onClose, onSubmit, initialContent = '', mode = 'add', commentId, postId }) => {
    const [replyContent, setReplyContent] = useState(initialContent);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleReplyChange = (e) => setReplyContent(e.target.value);
    const handleCancelDiscard = () => setIsAlertDialogOpen(false);

    const handleEmojiSelect = (emoji) => {
        setReplyContent(prev => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            if (mode === 'edit') {
                await onSubmit(postId, commentId, replyContent);
                onClose();
            } else {
                await onSubmit(replyContent);
                setReplyContent('');
                onClose();
            }
        } finally {
            setIsSubmitting(false);
            onClose();
        }
    };

    const handleDiscardChanges = () => {
        setIsAlertDialogOpen(false);
        setReplyContent('');
    };

    const handleOpenChange = (open) => {
        if (!open && mode !== 'edit' && replyContent.trim() !== '') {
            setIsAlertDialogOpen(true);
        } else {
            onOpenChange(open);
            setShowEmojiPicker(false);
        }
    };

    useEffect(() => {
        setReplyContent(isOpen ? initialContent : '');
    }, [isOpen, initialContent]);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-visible bg-white rounded-2xl">
                    <DialogHeader className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-100">
                                <FaRegCommentDots className="w-5 h-5 text-blue-600" />
                            </div>
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                                {mode === 'edit' ? 'Edit Comment' : 'Add Comment'}
                            </DialogTitle>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="px-6 pt-4">
                            <div className="relative">
                                <textarea
                                    placeholder="Write your comment..."
                                    value={replyContent}
                                    onChange={handleReplyChange}
                                    className="w-full min-h-[120px] p-4 text-gray-700 placeholder-gray-400 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                                    rows={3}
                                />
                                <div className="absolute right-0 bottom-0 p-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className={`p-2 rounded-lg transition-all duration-200 ${
                                            showEmojiPicker
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                                        }`}
                                    >
                                        <RiEmotionHappyLine className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Emoji Picker với vị trí mới */}
                                {showEmojiPicker && (
                                    <div
                                        className="absolute bottom-14 right-0 z-50"
                                        style={{
                                            boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
                                        }}
                                    >
                                        <div className="relative bg-white rounded-2xl overflow-hidden">
                                            <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-white to-transparent z-10" />
                                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10" />
                                            <div className="max-h-[300px] overflow-auto custom-scrollbar">
                                                <Picker
                                                    data={data}
                                                    onEmojiSelect={handleEmojiSelect}
                                                    theme="light"
                                                    previewPosition="none"
                                                    skinTonePosition="none"
                                                    searchPosition="top"
                                                    perLine={8}
                                                    maxFrequentRows={0}
                                                    navPosition="bottom"
                                                    emojiSize={24}
                                                    emojiButtonSize={32}
                                                    categories={["people", "nature", "foods", "activity", "places", "objects", "symbols", "flags"]}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="px-6 pb-4 flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting || !replyContent.trim()}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200 min-w-[120px]"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>{mode === 'edit' ? 'Updating...' : 'Posting...'}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <IoSend className="w-4 h-4" />
                                        <span>{mode === 'edit' ? 'Update' : 'Comment'}</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {mode !== 'edit' && (
                <Alert
                    title="Discard comment?"
                    actionText="Discard"
                    description="Are you sure you want to discard this comment? Your changes will not be saved."
                    isAlertDialogOpen={isAlertDialogOpen}
                    setIsAlertDialogOpen={setIsAlertDialogOpen}
                    handleCancelDiscard={handleCancelDiscard}
                    handleDiscardChanges={() => {
                        handleDiscardChanges();
                        onOpenChange(false);
                    }}
                />
            )}
        </>
    );
};

export default CommentDialog;
