import React, { useState, useCallback } from 'react'
import Search from '@/components/search/Search'
import useUserZ from '@/zustand/useUserZ'
import ListUserSearch from '@/components/search/ListSearch'
import { useAuthContext } from '@/context/AuthContext'

const SearchPage = () => {
    const { searchUser } = useUserZ()
    const { authUser } = useAuthContext()
    const [users, setUsers] = useState(undefined)

    const handleSearch = async (username) => {
        const users = await searchUser(username)
        setUsers(users)
    }

    const handleFollowToggle = useCallback((userId) => {
        setUsers((prevUsers) =>
            prevUsers.map((user) =>
                user._id === userId
                    ? {
                        ...user,
                        followers: user.followers.some((f) => f._id === authUser?._id)
                            ? user.followers.filter((f) => f._id !== authUser?._id)
                            : [...user.followers, { _id: authUser?._id }],
                    }
                    : user
            )
        );
    }, [authUser?._id]);

    return (
        <div className="space-y-6">
            {/* Header */}
            <h1 className='text-3xl font-bold text-center animate-fade-in'>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Search Users
                </span>
            </h1>

            {/* Main Content */}
            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
                {/* Search Bar Section */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 p-4">
                    <Search onSearch={handleSearch} />
                </div>

                {/* Results Section */}
                <div className="divide-y divide-gray-100">
                    <ListUserSearch
                        items={users}
                        currentUser={authUser}
                        onFollowToggle={handleFollowToggle}
                    />
                </div>
            </div>
        </div>
    )
}

export default SearchPage
