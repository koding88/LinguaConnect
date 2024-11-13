import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import usePostZ from '@/zustand/usePostZ';
import { toast } from 'react-toastify';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { IoImageOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { BsPencilSquare } from "react-icons/bs";
import { RiEmotionHappyLine } from "react-icons/ri";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const MAX_IMAGES = 5;

const EditPostLogCustom = ({ ...props }) => {
    const [content, setContent] = useState(props?.post?.content || '');
    const [existingImages, setExistingImages] = useState(props?.post?.images || []);
    const [originalImages, setOriginalImages] = useState(props?.post?.images || []);
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    useEffect(() => {
        setContent(props?.post?.content || '');
        setExistingImages(props?.post?.images || []);
        setOriginalImages(props?.post?.images || []);
        setNewImages([]);
        setNewImagePreviews([]);
    }, [props?.post, props?.isOpen]);

    const handleContentChange = (e) => setContent(e.target.value);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (existingImages.length + newImages.length + files.length > MAX_IMAGES) {
            toast.error(`You can only upload up to ${MAX_IMAGES} images`);
            return;
        }
        setNewImages(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setNewImagePreviews(prev => [...prev, ...newPreviews]);
    }

    const handleRemoveExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    }

    const handleRemoveNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setIsUpdating(true);
            await props?.onEdit(props?.post?._id, content, newImages, existingImages, originalImages);
            await new Promise(resolve => setTimeout(resolve, 500));
            props?.onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while updating the post");
        } finally {
            setIsUpdating(false);
        }
    }

    const handleEmojiSelect = (emoji) => {
        setContent(prev => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    const totalImages = existingImages.length + newImagePreviews.length;

    return (
        <Dialog open={props?.isOpen} onOpenChange={props?.onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-visible bg-white rounded-2xl">
                <DialogHeader className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-100">
                            <BsPencilSquare className="w-5 h-5 text-blue-600" />
                        </div>
                        <DialogTitle className="text-xl font-semibold text-gray-900">Edit Post</DialogTitle>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* User Info */}
                    <div className="px-6 pt-4 flex items-center gap-3">
                        <Avatar className="w-10 h-10 ring-2 ring-purple-100">
                            <AvatarImage src={props?.user?.avatarUrl} alt={props?.user?.username} className="object-cover" />
                            <AvatarFallback>{props?.user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900">{props?.user?.username}</span>
                    </div>

                    {/* Content */}
                    <div className="px-6">
                        <div className="relative">
                            <textarea
                                placeholder="What's on your mind?"
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
                    {(existingImages.length > 0 || newImagePreviews.length > 0) && (
                        <div className="px-6 overflow-x-auto">
                            <div className={`flex gap-2 ${totalImages > 1 ? 'overflow-x-scroll' : ''} pb-2`}
                                style={{ scrollSnapType: 'x mandatory' }}>
                                {/* Existing Images */}
                                {existingImages.map((image, index) => (
                                    <div key={`existing-${index}`}
                                        className="relative group shrink-0"
                                        style={{ scrollSnapAlign: 'start' }}>
                                        <img
                                            src={image}
                                            alt={`Existing ${index + 1}`}
                                            className="w-[200px] h-[200px] object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                                        >
                                            <RxCross2 className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded-full text-white text-xs">
                                            {index + 1}/{totalImages}
                                        </div>
                                    </div>
                                ))}
                                {/* New Image Previews */}
                                {newImagePreviews.map((preview, index) => (
                                    <div key={`new-${index}`}
                                        className="relative group shrink-0"
                                        style={{ scrollSnapAlign: 'start' }}>
                                        <img
                                            src={preview}
                                            alt={`New ${index + 1}`}
                                            className="w-[200px] h-[200px] object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewImage(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
                                        >
                                            <RxCross2 className="w-4 h-4" />
                                        </button>
                                        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 rounded-full text-white text-xs">
                                            {existingImages.length + index + 1}/{totalImages}
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
                                    totalImages >= MAX_IMAGES || isUpdating
                                        ? 'bg-gray-100 cursor-not-allowed'
                                        : 'hover:bg-gray-100 cursor-pointer'
                                }`}
                            >
                                <IoImageOutline className={`w-6 h-6 ${
                                    totalImages >= MAX_IMAGES || isUpdating ? 'text-gray-400' : 'text-blue-600'
                                }`} />
                            </Label>
                            <Input
                                id="picture"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={totalImages >= MAX_IMAGES || isUpdating}
                            />
                            <span className={`text-sm ${
                                totalImages >= MAX_IMAGES ? 'text-red-500' : 'text-gray-500'
                            }`}>
                                {totalImages}/{MAX_IMAGES} images
                            </span>
                        </div>
                        <Button
                            type="submit"
                            disabled={isUpdating || (!content.trim() && existingImages.length === 0 && newImages.length === 0)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200 min-w-[120px]"
                        >
                            {isUpdating ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Updating...</span>
                                </div>
                            ) : (
                                'Update Post'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditPostLogCustom
