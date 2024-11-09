import React from 'react';
import { Phone } from 'lucide-react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

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
            {/* AlertDialog for Outgoing Call */}
            <AlertDialog open={isCalling}>
                <AlertDialogContent className="flex flex-col items-center p-8 max-w-sm mx-auto rounded-2xl">
                    <AlertDialogHeader className="text-center w-full">
                        <div className="relative mb-6">
                            <img
                                src={selectedConversation?.avatarUrl}
                                alt="Caller avatar"
                                className="w-28 h-28 rounded-full border-4 border-blue-500 mx-auto shadow-lg"
                            />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md">
                                {callStatus === true ? 'Calling...' : 'Call Rejected'}
                            </div>
                        </div>
                        <AlertDialogTitle className="text-2xl text-center font-semibold mb-3">
                            {selectedConversation?.full_name || selectedConversation?.username}
                        </AlertDialogTitle>
                    </AlertDialogHeader>

                    <div className="flex items-center justify-center mt-8">
                        <button
                            className="p-5 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            onClick={onEndCall}
                        >
                            <Phone className="w-7 h-7 text-white rotate-135" />
                        </button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* AlertDialog for Incoming Call */}
            <AlertDialog open={isIncomingCall}>
                <AlertDialogContent className="flex flex-col items-center p-8 max-w-sm mx-auto rounded-2xl">
                    <AlertDialogHeader className="text-center w-full">
                        <div className="relative mb-6">
                            <img
                                src={callerInfo?.avatarUrl}
                                alt="Caller avatar"
                                className="w-28 h-28 rounded-full border-4 border-blue-500 mx-auto shadow-lg animate-pulse"
                            />
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md">
                                Incoming Call...
                            </div>
                        </div>
                        <AlertDialogTitle className="text-2xl text-center font-semibold mb-3">
                            {callerInfo?.full_name || callerInfo?.username}
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <button
                            className="p-5 bg-green-500 hover:bg-green-600 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            onClick={onAcceptCall}
                        >
                            <Phone className="w-7 h-7 text-white" />
                        </button>
                        <button
                            className="p-5 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            onClick={onRejectCall}
                        >
                            <Phone className="w-7 h-7 text-white rotate-135" />
                        </button>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default CallDialogs;
