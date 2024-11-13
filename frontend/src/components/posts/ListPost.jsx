import React from 'react'
import Post from './Post'

const ListPost = ({ posts }) => {
    return (
        <div className="space-y-6">
            {posts?.map((post) => (
                <div
                    key={post._id}
                    className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-purple-100"
                >
                    <Post post={post} />
                </div>
            ))}
        </div>
    )
}

export default ListPost
