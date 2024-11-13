import React, { useEffect } from 'react'
import Search from '@/components/search/Search'
import { useAuthContext } from '@/context/AuthContext'
import CreateGroup from '@/components/group/CreateGroup'
import useGroupZ from '@/zustand/useGroupZ'
import ListGroup from '@/components/group/ListGroup'

const Group = () => {
    const { authUser } = useAuthContext()
    const { getGroups, createGroup, groups, searchGroup } = useGroupZ()

    useEffect(() => {
        getGroups()
    }, [])

    const handleSearch = async (search) => {
        await searchGroup(search)
    }

    const handleGroupCreated = async (newGroup) => {
        await createGroup(newGroup.name, newGroup.description)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <h1 className='text-3xl font-bold text-center animate-fade-in'>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                    Groups
                </span>
            </h1>

            {/* Main Content */}
            <div className='bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden'>
                {/* Search and Create Section */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100 p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center max-w-2xl mx-auto">
                        <div className="flex-grow w-full">
                            <Search
                                onSearch={handleSearch}
                                placeholder="Search groups..."
                                buttonText="Search"
                            />
                        </div>
                        <CreateGroup
                            onGroupCreated={handleGroupCreated}
                            className="w-full md:w-auto whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Groups List */}
                <div className="divide-y divide-gray-100">
                    <ListGroup items={groups} currentUser={authUser} />
                </div>
            </div>
        </div>
    )
}

export default Group
