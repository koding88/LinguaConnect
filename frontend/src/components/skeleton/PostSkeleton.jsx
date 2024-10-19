import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

const PostSkeleton = () => {
  return (
    <div className="border-b border-[#D5D5D5] p-4">
            <div className="flex items-start mb-4">
                <Skeleton className="w-10 h-10 rounded-full mr-4" />
                <div className="flex-grow">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                            <Skeleton className="h-4 w-[100px] mr-2" />
                            <Skeleton className="h-4 w-[60px]" />
                        </div>
                    </div>
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-[200px] w-full mb-4" />
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-6" />
                    </div>
                </div>
            </div>
        </div>
  )
}

export default PostSkeleton
