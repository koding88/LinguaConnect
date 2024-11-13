import React from 'react'
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '@/components/ui/alert-dialog'
import { RiErrorWarningLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { FiAlertTriangle } from "react-icons/fi";

const Alert = ({ title, description, isAlertDialogOpen, setIsAlertDialogOpen, handleCancelDiscard, handleDiscardChanges, actionText, handleConfirm }) => {
    const isDestructive = actionText?.toLowerCase() === 'discard' || actionText?.toLowerCase() === 'delete';

    return (
        <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
            <AlertDialogContent className="bg-white rounded-2xl border border-gray-100 shadow-lg max-w-[400px] p-0">
                <div className="p-6">
                    <AlertDialogHeader className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl ${isDestructive ? 'bg-red-100' : 'bg-blue-100'}`}>
                                {isDestructive ? (
                                    <FiAlertTriangle className="w-6 h-6 text-red-600" />
                                ) : (
                                    <RiErrorWarningLine className="w-6 h-6 text-blue-600" />
                                )}
                            </div>
                            <AlertDialogTitle className="text-xl font-semibold text-gray-900">
                                {title}
                            </AlertDialogTitle>
                        </div>
                        <AlertDialogDescription className="text-gray-600 text-base leading-relaxed">
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </div>

                <AlertDialogFooter className="bg-gray-50 p-4 rounded-b-2xl border-t border-gray-100">
                    <div className="flex gap-3 w-full flex-col sm:flex-row">
                        <AlertDialogCancel
                            onClick={handleCancelDiscard}
                            className="flex-1 bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl transition-all duration-200"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <IoClose className="w-4 h-4" />
                                Cancel
                            </div>
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDiscardChanges || handleConfirm}
                            className={`flex-1 rounded-xl transition-all duration-200 ${
                                isDestructive
                                    ? 'bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg text-white'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg text-white'
                            }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                {isDestructive ? (
                                    <FiAlertTriangle className="w-4 h-4" />
                                ) : (
                                    <RiErrorWarningLine className="w-4 h-4" />
                                )}
                                {actionText}
                            </div>
                        </AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Alert
