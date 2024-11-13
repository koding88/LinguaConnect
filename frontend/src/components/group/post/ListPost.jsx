import React from 'react'
import Post from './Post'

const ListPost = ({ posts }) => {
    if (!posts?.length) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-500">No posts yet</div>
                <div className="text-sm text-gray-400 mt-1">Be the first to post in this group!</div>
            </div>
        )
    }

    return (
        <div className="space-y-4 bg-white rounded-xl divide-y divide-gray-100">
            {posts?.map((post) => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    )
}

export default ListPost
