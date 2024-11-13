import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminPageLayout from '@/components/admin/AdminPageLayout'
import DataTable from '@/components/admin/DataTable'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash } from "lucide-react"
import useTopic from '@/zustand/useTopic'

const ManageTopic = () => {
    const navigate = useNavigate()
    const [filterName, setFilterName] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    const [columnVisibility, setColumnVisibility] = useState({
        name: true,
        description: true,
        createdAt: true
    })

    const { topics, getTopics, deleteTopic } = useTopic();

    React.useEffect(() => {
        getTopics();
    }, [getTopics]);

    const ITEMS_PER_PAGE = 5;
    const filteredTopics = topics.filter(topic =>
        topic.name.toLowerCase().includes(filterName.toLowerCase())
    )
    const pageCount = Math.ceil(filteredTopics.length / ITEMS_PER_PAGE)
    const displayedTopics = filteredTopics.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    )

    const handleEditTopic = (topic) => {
        navigate(`/admin/manage/topics/${topic._id}/edit`, {
            state: { topic }
        })
    }

    const handleDeleteTopic = (id) => {
        deleteTopic(id)
    }

    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (topic) =>
                <div className="truncate">
                    {topic.name}
                </div>
        },
        {
            key: 'description',
            label: 'Description',
            render: (topic) => topic.description.length > 100 ? topic.description.substring(0, 100) + '...' : topic.description
        },
        {
            key: 'createdAt',
            label: 'Create At',
            render: (topic) => new Date(topic.createdAt).toLocaleString('vi-VN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })
        }
    ]

    const renderRowActions = (topic) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation()
                        handleEditTopic(topic)
                    }}
                >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Topic
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteTopic(topic._id)
                    }}
                    className="text-red-600"
                >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete Topic
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )

    const renderCustomHeader = () => (
        <Button
            onClick={() => navigate('/admin/manage/topics/create')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white ml-2 hover:shadow-lg transition-all duration-200"
        >
            Create
        </Button>
    )

    return (
        <AdminPageLayout title="Manage Topic">
            <DataTable
                columns={columns}
                data={displayedTopics}
                filterPlaceholder="Filter topics..."
                filterValue={filterName}
                onFilterChange={setFilterName}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={setCurrentPage}
                onRowClick={(id) => navigate(`/admin/manage/topics/${id}`)}
                renderRowActions={renderRowActions}
                renderCustomHeader={renderCustomHeader}
            />
        </AdminPageLayout>
    )
}

export default ManageTopic
