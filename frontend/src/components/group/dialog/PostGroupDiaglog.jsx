import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import Alert from '@/components/alert/Alert'
import useGroupZ from '@/zustand/useGroupZ'

const PostGroupDialog = ({ isOpen, onClose, user, groupId, onPostCreated }) => {
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const { createGroupPost, loading } = useGroupZ();
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setContent('');
            setImages([]);
        }
    }, [isOpen]);

    const handleContentChange = e => setContent(e.target.value);
    const handleImageChange = e => setImages(Array.from(e.target.files));

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createGroupPost(groupId, content, images);
        setContent('');
        setImages([]);
        onPostCreated();
        onClose();
    };

    const handleClose = () => {
        (content.trim() || images.length) ? setIsAlertDialogOpen(true) : onClose();
    };

    const handleCancelDiscard = () => setIsAlertDialogOpen(false);
    const handleDiscardChanges = () => {
        setIsAlertDialogOpen(false);
        setContent('');
        setImages([]);
        onClose();
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-center">Create Group Post</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2 mb-4">
                        <img className="w-10 h-10 rounded-full" src={`${user?.avatarUrl}`} alt="User avatar" />
                        <span>{user?.full_name}</span>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            id="post"
                            placeholder="Share something with the group..."
                            className="w-full mb-4 h-32 resize-none overflow-y-auto p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleContentChange}
                            value={content}
                        />
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="picture">Pictures</Label>
                            <Input id="picture" type="file" multiple onChange={handleImageChange} />
                        </div>
                        {images.length > 0 && (
                            <p className="mt-2 text-sm text-gray-500">{images.length} file(s) selected</p>
                        )}
                        <DialogFooter>
                            <Button type="submit" disabled={loading} className="w-full mt-4">
                                {loading ? 'Posting...' : 'Post'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Alert
                title="Discard post?"
                description="Are you sure you want to discard this post? Your changes will not be saved."
                isAlertDialogOpen={isAlertDialogOpen}
                setIsAlertDialogOpen={setIsAlertDialogOpen}
                handleCancelDiscard={handleCancelDiscard}
                handleDiscardChanges={handleDiscardChanges}
                actionText="Discard"
            />
        </>
    )
}

export default PostGroupDialog
