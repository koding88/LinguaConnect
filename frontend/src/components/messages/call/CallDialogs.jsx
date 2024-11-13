import React from 'react';
import { Phone } from 'lucide-react';
import { AlertDialog, AlertDialogContent } from '@/components/ui/alert-dialog';

const CallDialogs = ({
    isCalling,
    isIncomingCall,
    selectedConversation,
    callerInfo,
    callStatus,
    onEndCall,
    onAcceptCall,
    onRejectCall
}) => {
    return (
        <>
            {/* Outgoing Call Dialog */}
            <AlertDialog open={isCalling}>
                <AlertDialogContent className="bg-white/95 backdrop-blur-sm p-8 max-w-sm mx-auto rounded-2xl border border-gray-100">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-blue-500 p-1">
                                <img
                                    src={selectedConversation?.avatarUrl}
                                    alt="Caller avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full
                                          bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium shadow-lg">
                                {callStatus === true ? 'Calling...' : 'Call Rejected'}
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            {selectedConversation?.full_name || selectedConversation?.username}
                        </h2>

                        <button
                            onClick={onEndCall}
                            className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full
                                     transition-all duration-200 hover:scale-105 shadow-lg"
                        >
                            <Phone className="w-6 h-6 text-white rotate-135" />
                        </button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Incoming Call Dialog */}
            <AlertDialog open={isIncomingCall}>
                <AlertDialogContent className="bg-white/95 backdrop-blur-sm p-8 max-w-sm mx-auto rounded-2xl border border-gray-100">
                    <div className="flex flex-col items-center space-y-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-blue-500 p-1 animate-pulse">
                                <img
                                    src={callerInfo?.avatarUrl}
                                    alt="Caller avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full
                                          bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium shadow-lg">
                                Incoming Call...
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            {callerInfo?.full_name || callerInfo?.username}
                        </h2>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={onAcceptCall}
                                className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full
                                         transition-all duration-200 hover:scale-105 shadow-lg"
                            >
                                <Phone className="w-6 h-6 text-white" />
                            </button>
                            <button
                                onClick={onRejectCall}
                                className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full
                                         transition-all duration-200 hover:scale-105 shadow-lg"
                            >
                                <Phone className="w-6 h-6 text-white rotate-135" />
                            </button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CallDialogs;
