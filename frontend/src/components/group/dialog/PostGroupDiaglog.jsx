import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Alert from '@/components/alert/Alert'
import useGroupZ from '@/zustand/useGroupZ'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { IoImageOutline } from "react-icons/io5"
import { RxCross2 } from "react-icons/rx"
import { BsPencilSquare } from "react-icons/bs"
import { RiEmotionHappyLine } from "react-icons/ri"
import { toast } from 'react-toastify'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

const MAX_IMAGES = 5;

const PostGroupDialog = ({ isOpen, onClose, user, groupId, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const { createGroupPost, loading } = useGroupZ();
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setContent('');
            setImages([]);
            setPreviewUrls([]);
        }
    }, [isOpen]);

    const handleContentChange = e => setContent(e.target.value);

    const handleImageChange = e => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > MAX_IMAGES) {
            toast.error(`You can only upload up to ${MAX_IMAGES} images`);
            return;
        }

        setImages(prev => [...prev, ...files]);
        const newPreviewUrls = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (content.trim() || images.length > 0) {
            await createGroupPost(groupId, content, images);
            setContent('');
            setImages([]);
            setPreviewUrls([]);
            onPostCreated();
            onClose();
        }
    };

    const handleEmojiSelect = (emoji) => {
        setContent(prev => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={() => (content.trim() || images.length) ? setIsAlertDialogOpen(true) : onClose()}>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-visible bg-white rounded-2xl">
                    <DialogHeader className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-100">
                                <BsPencilSquare className="w-5 h-5 text-blue-600" />
                            </div>
                            <DialogTitle className="text-xl font-semibold text-gray-900">Create Group Post</DialogTitle>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* User Info */}
                        <div className="px-6 pt-4 flex items-center gap-3">
                            <Avatar className="w-10 h-10 ring-2 ring-purple-100">
                                <AvatarImage src={user?.avatarUrl} alt={user?.username} className="object-cover" />
                                <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900">{user?.username}</span>
                        </div>

                        {/* Content */}
                        <div className="px-6">
                            <div className="relative">
                                <textarea
                                    placeholder="Share something with the group..."
                                    className="w-full min-h-[120px] p-4 text-gray-700 placeholder-gray-400 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                                    onChange={handleContentChange}
                                    value={content}
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

                                {/* Emoji Picker */}
                                {showEmojiPicker && (
                                    <div
                                        className="absolute bottom-14 right-0 z-50"
                                        style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' }}
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

                        {/* Image Previews */}
                        {previewUrls.length > 0 && (
                            <div className="px-6 overflow-x-auto">
                                <div className={`flex gap-2 ${previewUrls.length > 1 ? 'overflow-x-scroll' : ''} pb-2`}
                                    style={{ scrollSnapType: 'x mandatory' }}>
                                    {previewUrls.map((url, index) => (
                                        <div key={index}
                                            className="relative group shrink-0"
                                            style={{ scrollSnapAlign: 'start' }}>
                                            <img
                                                src={url}
                                                alt={`Preview ${index + 1}`}
                                                className="w-[200px] h-[200px] object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                                            >
                                                <RxCross2 className="w-4 h-4" />
                                            </button>
                                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded-full text-white text-xs">
                                                {index + 1}/{previewUrls.length}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="px-6 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Label
                                    htmlFor="picture"
                                    className={`p-2 rounded-lg transition-colors duration-200 ${
                                        images.length >= MAX_IMAGES
                                            ? 'bg-gray-100 cursor-not-allowed'
                                            : 'hover:bg-gray-100 cursor-pointer'
                                    }`}
                                >
                                    <IoImageOutline className={`w-6 h-6 ${
                                        images.length >= MAX_IMAGES ? 'text-gray-400' : 'text-blue-600'
                                    }`} />
                                </Label>
                                <Input
                                    id="picture"
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    disabled={images.length >= MAX_IMAGES}
                                />
                                {images.length > 0 && (
                                    <span className={`text-sm ${
                                        images.length >= MAX_IMAGES ? 'text-red-500' : 'text-gray-500'
                                    }`}>
                                        {images.length}/{MAX_IMAGES} images
                                    </span>
                                )}
                            </div>
                            <Button
                                type="submit"
                                disabled={loading || (!content.trim() && images.length === 0)}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200 min-w-[120px]"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Posting...</span>
                                    </div>
                                ) : (
                                    'Post'
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Alert
                title="Discard post?"
                description="Are you sure you want to discard this post? Your changes will not be saved."
                isAlertDialogOpen={isAlertDialogOpen}
                setIsAlertDialogOpen={setIsAlertDialogOpen}
                handleCancelDiscard={() => setIsAlertDialogOpen(false)}
                handleDiscardChanges={() => {
                    setIsAlertDialogOpen(false);
                    setContent('');
                    setImages([]);
                    setPreviewUrls([]);
                    onClose();
                }}
                actionText="Discard"
            />
        </>
    )
}

export default PostGroupDialog
