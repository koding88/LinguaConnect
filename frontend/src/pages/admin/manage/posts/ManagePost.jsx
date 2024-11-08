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
import { MoreHorizontal, Eye, EyeOff } from "lucide-react"
import usePostZ from '@/zustand/usePostZ';

const ManagePost = () => {
    const { posts, getPosts, hidePost, unhidePost } = usePostZ();
    const navigate = useNavigate()
    const [filterContent, setFilterContent] = useState("")
    const [currentPage, setCurrentPage] = useState(0)
    const [columnVisibility, setColumnVisibility] = useState({
        user: true,
        content: true,
        likes: true,
        comments: true,
        status: true,
        report: true
    })

    React.useEffect(() => {
        getPosts();
    }, [getPosts])

    const ITEMS_PER_PAGE = 5;
    const filteredPosts = posts.filter(post =>
        post.content.toLowerCase().includes(filterContent.toLowerCase())
    )
    const pageCount = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE)
    const displayedPosts = filteredPosts.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    )

    const handleHidePost = (id) => {
        hidePost(id)
    }

    const handleUnhidePost = (id) => {
        unhidePost(id)
    }

    const columns = [
        {
            key: 'user',
            label: 'User',
            render: (post) => post.user?.full_name || 'Unknown User'
        },
        { key: 'content', label: 'Content' },
        {
            key: 'likes',
            label: 'Likes',
            render: (post) => post.likes?.length || 0
        },
        {
            key: 'comments',
            label: 'Comments',
            render: (post) => (
                <div className="ml-8">{post.comments?.length || 0}</div>
            )
        },
        {
            key: 'status',
            label: 'Status',
            render: (post) => <StatusBadge status={post.status} variant="post" />
        },
        {
            key: 'report',
            label: 'Report',
            render: (post) => (
                <div className="ml-4">{post.report?.length || 0}</div>
            )
        }
    ]

    const renderRowActions = (post) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {post.status === 'public' ? (
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            handleHidePost(post._id)
                        }}
                    >
                        <EyeOff className="mr-2 h-4 w-4" />
                        Hide Post
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem
                        onClick={(e) => {
                            e.stopPropagation()
                            handleUnhidePost(post._id)
                        }}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        Unhide Post
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )

    return (
        <AdminPageLayout title="Manage Post">
            <DataTable
                columns={columns}
                data={displayedPosts}
                filterPlaceholder="Filter content..."
                filterValue={filterContent}
                onFilterChange={setFilterContent}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                currentPage={currentPage}
                pageCount={pageCount}
                onPageChange={setCurrentPage}
                onRowClick={(id) => navigate(`/admin/manage/posts/${id}`)}
                renderRowActions={renderRowActions}
            />
        </AdminPageLayout>
    )
}

export default ManagePost
