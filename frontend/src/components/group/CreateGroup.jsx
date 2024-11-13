import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'react-toastify';
import { FiPlus, FiUsers, FiType, FiAlignLeft } from 'react-icons/fi';

const CreateGroup = ({ onGroupCreated }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [open, setOpen] = useState(false);

    const validateInputs = () => {
        if (name.length < 1 || name.length > 30) {
            toast.error('Name must be between 1 and 30 characters');
            return false;
        }
        if (description.length < 1 || description.length > 50) {
            toast.error('Description must be between 1 and 50 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInputs()) return;
        onGroupCreated({ name, description })
        setOpen(false);
        setName('');
        setDescription('');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                    <FiPlus className="w-5 h-5" />
                    Create Group
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FiUsers className="w-5 h-5 text-purple-600" />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Create New Group
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-500">
                        Create a space for your community to connect and share.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="name"
                                className="text-sm font-medium flex items-center gap-2 text-gray-700"
                            >
                                <FiType className="w-4 h-4 text-purple-500" />
                                Group Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="Enter a unique name for your group"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                maxLength={30}
                                className="rounded-xl border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                            />
                            <div className="text-xs text-right text-gray-400">
                                {name.length}/30 characters
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="description"
                                className="text-sm font-medium flex items-center gap-2 text-gray-700"
                            >
                                <FiAlignLeft className="w-4 h-4 text-purple-500" />
                                Description
                            </Label>
                            <Textarea
                                id="description"
                                placeholder="What's your group about?"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                maxLength={50}
                                className="rounded-xl min-h-[100px] border-gray-200 focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all duration-200"
                            />
                            <div className="text-xs text-right text-gray-400">
                                {description.length}/50 characters
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <div className="flex justify-end gap-2 w-full">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="rounded-xl border-gray-200 hover:bg-gray-50 px-6"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl px-6"
                            >
                                Create Group
                            </Button>
                        </div>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateGroup;
