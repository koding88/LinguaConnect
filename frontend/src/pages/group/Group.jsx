import React, { useEffect } from 'react'
import Header from '@/components/header/Header'
import Search from '@/components/search/Search'
import { useAuthContext } from '@/context/AuthContext'
import { toast } from 'react-toastify'
import CreateGroup from '@/components/group/CreateGroup'
import useGroupZ from '@/zustand/useGroupZ'
import ListGroup from '@/components/group/ListGroup'

const Group = () => {
    const { authUser } = useAuthContext()

    const { getGroups, createGroup, groups, searchGroup } = useGroupZ()
    const [groupData, setGroupData] = React.useState([])

    React.useEffect(() => {
        getGroups()
    }, [])

    const handleSearch = async (search) => {
        await searchGroup(search)
        setGroupData(groups)
    }

    const handleGroupCreated = async (newGroup) => {
        const searchGroup = await createGroup(newGroup.name, newGroup.description)
        setGroupData([...groupData, searchGroup])
    }

    return (
        <>
            <Header props={{ path: '/', title: 'Groups' }} />

            <div className='flex-grow flex flex-col h-screen'>
                <div className='bg-white rounded-tl-[28px] rounded-tr-[28px] flex-1 border-[1px] border-[#D5D5D5] flex flex-col overflow-hidden'>
                    <div className="flex-grow overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-[#D5D5D5] p-4 w-full z-10">
                            <div className="flex items-center justify-center">
                                <Search onSearch={handleSearch} />
                                {/* Create Group Button */}
                                <CreateGroup onGroupCreated={handleGroupCreated} />
                            </div>
                        </div>

                        <ListGroup items={groups} currentUser={authUser} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Group
