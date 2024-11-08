import React from 'react'
import Post from './Post'

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
