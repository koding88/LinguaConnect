import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FaSearch, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import useGroupZ from '@/zustand/useGroupZ';

const ListGroup = ({ items, currentUser }) => {
    const [memberGroups, setMemberGroups] = useState([]);
    const { joinGroup } = useGroupZ();

    if (!items) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
                <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center">
                    <FaSearch className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Discover Groups</h3>
                <p className="text-sm text-gray-500 max-w-[250px] md:max-w-sm">
                    Search for groups or create your own to connect with people who share your interests
                </p>
            </div>
        );
    }

    const handleJoinGroup = async (groupId) => {
        await joinGroup(groupId);
        setMemberGroups([...memberGroups, groupId]);
    }

    return (
        <div className='min-h-[calc(100vh-200px)]'>
            <div className="sticky top-0 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 border-b border-gray-100">
                <p className="text-sm text-gray-500 font-medium">Found {items?.length} groups</p>
            </div>
            <div className="divide-y divide-gray-100">
                {items?.map((item) => {
                    const isMember = item?.members?.some(member => member._id === currentUser?._id) ||
                        memberGroups.includes(item._id) ||
                        item?.owner === currentUser?._id;
                    return (
                        <div key={item._id} className="p-4 md:p-6 hover:bg-gray-50 transition-all duration-200">
                            {/* Mobile Layout */}
                            <div className="md:hidden">
                                <div className="flex items-start gap-3 mb-3">
                                    <Link to={`/groups/${item?._id}`} className="shrink-0">
                                        <Avatar className="w-12 h-12 ring-2 ring-purple-100">
                                            <AvatarImage src={`${item?.avatarUrl}` || "https://avatar.iran.liara.run/public"} alt="Group avatar" />
                                            <AvatarFallback>{item?.name?.[0] || 'G'}</AvatarFallback>
                                        </Avatar>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/groups/${item?._id}`}>
                                            <h3 className="font-medium text-gray-900 truncate">{item?.name}</h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item?.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <FaUsers className="w-4 h-4" />
                                        <span className="text-sm">{item?.members?.length} members</span>
                                    </div>
                                    {isMember ? (
                                        <Link to={`/groups/${item._id}`}>
                                            <Button className="w-24 bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">
                                                View
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button
                                            onClick={() => handleJoinGroup(item._id)}
                                            className="w-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md"
                                        >
                                            Join
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {/* Desktop Layout */}
                            <div className="hidden md:flex items-center gap-4">
                                <Link to={`/groups/${item?._id}`} className="shrink-0">
                                    <Avatar className="w-12 h-12 ring-2 ring-purple-100">
                                        <AvatarImage src={`${item?.avatarUrl}` || "https://avatar.iran.liara.run/public"} alt="Group avatar" />
                                        <AvatarFallback>{item?.name?.[0] || 'G'}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <Link to={`/groups/${item?._id}`}>
                                        <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">{item?.name}</h3>
                                    </Link>
                                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">{item?.description}</p>
                                    <div className="flex items-center gap-1.5 text-gray-500 mt-2">
                                        <FaUsers className="w-4 h-4" />
                                        <span className="text-sm">{item?.members?.length} members</span>
                                    </div>
                                </div>
                                <div>
                                    {isMember ? (
                                        <Link to={`/groups/${item._id}`}>
                                            <Button className="min-w-[100px] bg-white text-gray-700 border border-gray-200 hover:bg-gray-50">
                                                View Group
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button
                                            onClick={() => handleJoinGroup(item._id)}
                                            className="min-w-[100px] bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-md"
                                        >
                                            Join Group
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ListGroup;
