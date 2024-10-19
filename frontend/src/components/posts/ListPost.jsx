import React from 'react'
import Post from './Post'
import { ScrollArea } from "@/components/ui/scroll-area"

const ListPost = ({ posts }) => {
    return (
        <>
            {posts?.map((post) => (
                <Post key={post._id} post={post} />
            ))}
    </>
    )
}

export default ListPost
