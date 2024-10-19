import React from 'react'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

const Follower = ({ followersCount, followers }) => {
    const scrollAreaHeight = followers?.length <= 3 ? 'h-auto' : 'h-80';

    const navigateToProfile = (id) => {
        window.location.href = `/profile/${id}`;
    };

    return (
        <HoverCard>
            <HoverCardTrigger asChild>
                <p className="mt-4 text-sm">
                    <span className="font-semibold cursor-pointer">{followersCount.toLocaleString()}</span> Followers
                </p>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <h3 className="text-lg font-semibold mb-2">List Followers</h3>
                <ScrollArea className={scrollAreaHeight}>
                    <div className="space-y-4">
                        {followers?.map((follower) => (
                            <div key={follower._id} className="flex items-center space-x-4">
                                <Avatar onClick={() => navigateToProfile(follower._id)} className="cursor-pointer">
                                    <AvatarImage src={follower.avatarUrl} alt={follower.full_name} />
                                    <AvatarFallback>{follower.full_name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div onClick={() => navigateToProfile(follower._id)} className="cursor-pointer">
                                    <h4 className="text-sm font-semibold">{follower.full_name}</h4>
                                    <p className="text-sm text-muted-foreground">@{follower.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </HoverCardContent>
        </HoverCard>
    );
};

export default Follower;
