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
import { MoreHorizontal, Eye, EyeOff, Image } from "lucide-react"
import usePostZ from '@/zustand/usePostZ';

const ManagePost = () => {
    const { posts, loading, getPosts, hidePost, unhidePost } = usePostZ();
    const navigate = useNavigate()
    const [filterContent, setFilterContent] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage] = useState(10)
    const [columnVisibility, setColumnVisibility] = useState({
        user: true,
        content: true,
        likes: true,
        comments: true,
        status: true,
        report: true
    })

    React.useEffect(() => {
        getPosts(currentPage, itemsPerPage);
    }, [getPosts, currentPage, itemsPerPage])

    const filteredPosts = posts?.filter(post =>
        post.content?.toLowerCase().includes(filterContent.toLowerCase())
    )

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    }

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
        {
            key: 'content',
            label: 'Content',
            render: (post) => {
                if ((!post.content || post.content.trim() === '') && post.images?.length > 0) {
                    return (
                        <div className="flex items-center text-gray-500">
                            <Image className="h-4 w-4 mr-2" />
                            <span>Image only post ({post.images.length})</span>
                        </div>
                    );
                }
                
                if (post.content) {
                    const maxLength = 100;
                    const displayContent = post.content.length > maxLength 
                        ? post.content.substring(0, maxLength) + '...'
                        : post.content;
                    
                    return (
                        <div className="flex items-center gap-2">
                            <span>{displayContent}</span>
                            {post.images?.length > 0 && (
                                <div className="flex items-center text-gray-500">
                                    <Image className="h-4 w-4" />
                                    <span className="text-sm">({post.images.length})</span>
                                </div>
                            )}
                        </div>
                    );
                }
                
                return 'No content';
            }
        },
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
                data={filteredPosts}
                filterPlaceholder="Filter content..."
                filterValue={filterContent}
                onFilterChange={setFilterContent}
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                currentPage={currentPage}
                pageCount={usePostZ.getState().pagination?.totalPages || 1}
                onPageChange={handlePageChange}
                onRowClick={(id) => navigate(`/admin/manage/posts/${id}`)}
                renderRowActions={renderRowActions}
                loading={loading}
            />
        </AdminPageLayout>
    )
}

export default ManagePost
