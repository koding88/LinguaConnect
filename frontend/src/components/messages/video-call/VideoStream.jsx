import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

const VideoStream = ({ id, stream, isMuted, label, avatarUrl, className }) => {
    const [hasVideo, setHasVideo] = React.useState(false);

    React.useEffect(() => {
        if (stream) {
            const videoTracks = stream.getVideoTracks();
            setHasVideo(videoTracks.length > 0 && videoTracks[0].enabled);

            const handleTrackEnabled = () => setHasVideo(true);
            const handleTrackDisabled = () => setHasVideo(false);

            videoTracks.forEach(track => {
                track.addEventListener('enabled', handleTrackEnabled);
                track.addEventListener('disabled', handleTrackDisabled);
            });

            return () => {
                videoTracks.forEach(track => {
                    track.removeEventListener('enabled', handleTrackEnabled);
                    track.removeEventListener('disabled', handleTrackDisabled);
                });
            };
        }
        setHasVideo(false);
    }, [stream]);

    return (
        <div className={cn("relative flex-1", className)}>
            <div className="w-full lg:h-[400px] aspect-video rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden border border-gray-200 shadow-lg">
                {hasVideo ? (
                    <video
                        key={id}
                        id={id}
                        autoPlay
                        playsInline
                        muted={isMuted}
                        className="w-full h-full sm object-cover"
                        ref={(el) => {
                            if (el && stream) el.srcObject = stream;
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                            {avatarUrl ? (
                                <AvatarImage src={avatarUrl} alt={label} />
                            ) : (
                                <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100">
                                    <User className="w-16 h-16 text-gray-400" />
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </div>
                )}
            </div>
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-black/50 backdrop-blur-sm text-white rounded-full text-sm">
                {label}
            </div>
        </div>
    );
};

export default VideoStream;
