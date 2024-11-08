import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { DialogFooter } from '@/components/ui/dialog'
import { useState, useEffect } from 'react';
import usePostZ from '@/zustand/usePostZ';
import { toast } from 'react-toastify';

const EditPostLogCustom = ({ ...props }) => {
    const [content, setContent] = useState(props?.post?.content || '');
    const [existingImages, setExistingImages] = useState(props?.post?.images || []);
    const [originalImages, setOriginalImages] = useState(props?.post?.images || []);
    const [newImages, setNewImages] = useState([]);

    useEffect(() => {
        setContent(props?.post?.content || '');
        setExistingImages(props?.post?.images || []);
        setOriginalImages(props?.post?.images || []);
        setNewImages([]);
    }, [props?.post, props?.isOpen]);

    const handleContentChange = (e) => {
        setContent(e.target.value);
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (existingImages.length + newImages.length + files.length > 5) {
            toast.error('Maximum 5 images allowed');
            return;
        }
        setNewImages(prevImages => [...prevImages, ...files]);
        e.target.value = '';
    }

    const handleRemoveExistingImage = (index) => {
        setExistingImages(prevImages => prevImages.filter((_, i) => i !== index));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log("newImages", newImages);
            console.log("existingImages", existingImages);
            console.log("originalImages", originalImages);
            await props?.onEdit(props?.post?._id, content, newImages, existingImages, originalImages);
            props?.onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while updating the post");
        }
    }

    return (
        <Dialog open={props?.isOpen} onOpenChange={props?.onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-center">Edit Post</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2 mb-4">
                    <img className="w-10 h-10 rounded-full" src={props?.user?.avatarUrl} alt="User avatar" />
                    <span>{props?.user?.full_name}</span>
                </div>
                <form onSubmit={handleSubmit}>
                    <textarea
                        id="post"
                        placeholder="What's on your mind?"
                        className="w-full mb-4 h-32 resize-none overflow-y-auto p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleContentChange}
                        value={content}
                    />

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="mb-4 max-w-full overflow-x-auto">
                            <div className="flex gap-2">
                                {existingImages.map((image, index) => (
                                    <div key={index} className="relative w-[48%] flex-shrink-0">
                                        <img
                                            src={image}
                                            alt={`Post image ${index + 1}`}
                                            className="w-full h-auto rounded-[6px] object-cover"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                            onClick={() => handleRemoveExistingImage(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Add New Pictures</Label>
                        <Input id="picture" type="file" multiple accept="image/*" onChange={handleImageChange} />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                        {existingImages.length + newImages.length}/5 images
                    </p>
                    <DialogFooter>
                        <Button type="submit" disabled={props?.loading} className="w-full mt-4">
                            {props?.loading ? 'Updating...' : 'Update Post'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditPostLogCustom
