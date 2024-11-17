import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminPageLayout from '@/components/admin/AdminPageLayout'
import DataTable from '@/components/admin/DataTable'
import StatusBadge from '@/components/admin/StatusBadge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import useGroup from '@/zustand/useGroup'

const ManageGroup = () => {
    const { groups, getGroups, blockGroup, unblockGroup } = useGroup()
    const navigate = useNavigate()
    const [filterName, setFilterName] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    const [columnVisibility, setColumnVisibility] = useState({
        name: true,
        description: true,
        owner: true,
        members: true,
        status: true
    })

    React.useEffect(() => {
        getGroups()
    }, [getGroups])

    const ITEMS_PER_PAGE = 5;
    const filteredGroups = groups.filter(group =>
        group.name.toLowerCase().includes(filterName.toLowerCase())
    )
    const pageCount = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE)
    const displayedGroups = filteredGroups.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    )

    const blockGroupHandler = async (id) => {
        blockGroup(id)
    }

    const unblockGroupHandler = async (id) => {
        unblockGroup(id)
    }

    const columns = [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        {
            key: 'owner',
            label: 'Owner',
            render: (group) => group.owner?.username
        },
        {
            key: 'members',
            label: 'Members',
            render: (group) => (
                <div className="ml-6">{group.members?.length}</div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (group) => <StatusBadge status={group?.status} />
        }
    ]

    const renderRowActions = (group) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {group.status === 'blocked' ? (
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            unblockGroupHandler(group._id)
                        }}
                    >
                        Unblock Group
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            blockGroupHandler(group._id)
                        }}
                    >
                        Block Group
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )

    return (
        <AdminPageLayout title="Manage Group">
            <DataTable
                columns={columns}
                data={displayedGroups}
                filterPlaceholder="Filter groups..."
                filterValue={filterName}
                onFilterChange={setFilterName}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={setCurrentPage}
                onRowClick={(id) => navigate(`/admin/manage/groups/${id}`)}
                renderRowActions={renderRowActions}
            />
        </AdminPageLayout>
    )
}

export default ManageGroup
