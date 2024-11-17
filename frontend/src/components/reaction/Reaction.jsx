import { IoMdHeart } from 'react-icons/io';
import { CiHeart } from 'react-icons/ci';
import { LuMessageCircle } from 'react-icons/lu';
import { getFlagImage } from '@/utils/flag';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Reaction = ({ post, isLiked, handleLike, handleOpenCommentDialog, group }) => {
    const HeartIcon = isLiked ? IoMdHeart : CiHeart;
    const heartClass = `h-6 w-6 mr-2 cursor-pointer transform transition-all duration-300 ${isLiked ? 'text-red-500 scale-125' : ''}`;
    const [isAnimating, setIsAnimating] = useState(false);

    const handleHeartClick = () => {
        setIsAnimating(true);
        handleLike();
        setTimeout(() => setIsAnimating(false), 1000);
    };

    return (
        <div className="flex items-center space-x-4">
            <div className="flex items-center relative">
                <HeartIcon
                    className={`${heartClass} ${isAnimating ? 'animate-bounce' : ''}`}
                    onClick={handleHeartClick}
                />
                {isAnimating && isLiked && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <div className="text-2xl animate-ping">❤️</div>
                    </div>
                )}
                <span className={`transition-all duration-300 ${isAnimating && isLiked ? 'text-red-500 font-bold' : ''}`}>
                    {post.likes?.length || 0}
                </span>
            </div>
            <div className="flex items-center cursor-pointer" onClick={handleOpenCommentDialog}>
                <Link to={group ? `/groups/${post.group}/posts/${post._id}` : `/post/${post._id}`}>
                    <LuMessageCircle className="w-6 h-6 mr-2" />
                </Link>
                <span>{post.comments?.length || 0}</span>
            </div>
            <div className="flex items-center">
                <img
                    src={getFlagImage(post.user?.location)}
                    alt={post.user?.location || 'User location'}
                    className="w-8 h-6 mr-2 rounded-sm"
                />
            </div>
        </div>
    );
};

export default Reaction;
