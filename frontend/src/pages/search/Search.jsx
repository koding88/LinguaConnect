import React, { useState, useCallback } from 'react'
import Header from '@/components/header/Header'
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
        <div>
            <Header props={{ path: '/', title: 'Search' }} />
            <div className='flex-grow flex flex-col h-screen'>
                <div className='bg-white rounded-tl-[28px] rounded-tr-[28px] flex-1 border-[1px] border-[#D5D5D5] flex flex-col overflow-hidden'>
                    <div className="flex-grow overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-[#D5D5D5] p-4 w-full z-10">
                            <div className="flex items-center justify-center">
                                <Search onSearch={handleSearch} />
                            </div>
                        </div>

                        <ListUserSearch
                            items={users}
                            currentUser={authUser}
                            onFollowToggle={handleFollowToggle}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchPage
