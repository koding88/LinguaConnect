import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Alert from '@/components/alert/Alert';

const CommentDialog = ({ isOpen, onOpenChange, onClose, onSubmit, initialContent = '', mode = 'add', commentId, postId }) => {
    const [replyContent, setReplyContent] = useState(initialContent);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

    const handleReplyChange = (e) => setReplyContent(e.target.value);
    const handleCancelDiscard = () => setIsAlertDialogOpen(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'edit') {
            onSubmit(postId, commentId, replyContent);
            onClose();
        } else {
            onSubmit(replyContent);
            setReplyContent('');
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
        }
    };

    useEffect(() => {
        setReplyContent(isOpen ? initialContent : '');
    }, [isOpen, initialContent]);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{mode === 'edit' ? 'Edit Comment' : 'Add a Comment'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <Textarea
                            placeholder="Write your comment..."
                            value={replyContent}
                            onChange={handleReplyChange}
                            className="w-full mb-4 resize-none"
                            rows={3}
                            style={{ maxHeight: '150px', overflowY: 'auto' }}
                        />
                        <DialogFooter>
                            <Button type="submit">{mode === 'edit' ? 'Save Changes' : 'Post Comment'}</Button>
                        </DialogFooter>
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
