import { create } from 'zustand';
import axiosClient from '@/api/axiosClient'
import { toast } from 'react-toastify';

const usePostZ = create((set, get) => ({
    posts: [],
    loading: false,
    error: null,
    lastFetchTime: null,

    getAllPosts: async (forceRefresh = false) => {
        const shouldFetch = forceRefresh || Date.now() - (get().lastFetchTime || 0) > 30000 || !get().posts.length;
        if (shouldFetch) {
            set({ loading: true });
            try {
                const { data } = await axiosClient.get('/posts');
                set({ posts: data.data, loading: false, lastFetchTime: Date.now() });
            } catch (error) {
                set({ loading: false });
                // toast.error(error.response?.data?.message || "Error fetching posts");
            }
        }
    },

    getPostById: async (postId) => {
        try {
            const { data } = await axiosClient.get(`/posts/${postId}`);
            return data.data;
        } catch (error) {
            // toast.error(error.response?.data?.message || "Error fetching post");
            return null;
        }
    },

    createPost: async (content, images = []) => {
        if (!handleInputErrors(content, images)) return;
        set({ loading: true });
        try {
            const formData = new FormData();
            formData.append('content', content);
            images.forEach(image => formData.append('files', image));
            const { data } = await axiosClient.post('/posts', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const newPost = (await axiosClient.get(`/posts/${data.data._id}`)).data.data;
            set(state => ({ posts: [newPost, ...state.posts], loading: false }));
            toast.success(data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error creating post");
        }
    },

    editPost: async (postId, content, newImages = [], existingImages = [], originalImages = []) => {
        if (!handleEditPostErrors(content, newImages, existingImages)) return;
        set({ loading: true });
        try {
            const formData = new FormData();
            formData.append('content', content);
            newImages.forEach(image => formData.append('files', image));
            originalImages.filter(url => !existingImages.includes(url)).forEach(url => formData.append('urls', url));
            await axiosClient.patch(`/posts/${postId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const updatedPost = (await axiosClient.get(`/posts/${postId}`)).data.data;
            set(state => ({
                posts: state.posts.map(post => post._id === postId ? updatedPost : post),
                loading: false
            }));
            toast.success("Post updated successfully");
            return updatedPost;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error editing post");
        }
    },

    deletePost: async (postId) => {
        set({ loading: true });
        try {
            await axiosClient.delete(`/posts/${postId}`);
            set(state => ({
                posts: state.posts.filter(post => post._id !== postId),
                loading: false
            }));
            toast.success("Post deleted successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error deleting post");
        }
    },

    likePost: async (postId, userId) => {
        if (!userId) {
            toast.error("Login required to like a post");
            return null;
        }
        try {
            const { data } = await axiosClient.patch(`/posts/${postId}/like`);
            set(state => ({
                posts: state.posts.map(post =>
                    post._id === postId ? { ...post, likes: data.data.likes } : post
                ),
            }));
            return data.data.likes;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error liking post");
            return null;
        }
    },

    addComment: async (postId, content) => {
        if (!content.trim()) {
            toast.error('Comment content required');
            return null;
        }
        try {
            const { data } = await axiosClient.post(`/comments/${postId}`, { content });
            set(state => ({
                posts: state.posts.map(post =>
                    post._id === postId ? { ...post, comments: data.data.comments } : post
                ),
            }));
            toast.success("Comment added successfully");
            return data.data.comments;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error adding comment");
            return null;
        }
    },

    editComment: async (postId, commentId, content) => {
        if (!content.trim()) {
            toast.error('Comment content required');
            return null;
        }
        try {
            const { data } = await axiosClient.patch(`/comments/${commentId}`, { content, postId });
            set(state => ({
                posts: state.posts.map(post =>
                    post._id === postId ? { ...post, comments: data.data.comments } : post
                ),
            }));
            toast.success("Comment updated successfully");
            return data.data.comments;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error editing comment");
            return null;
        }
    },

    deleteComment: async (postId, commentId) => {
        console.log('Deleting comment:', { postId, commentId });
        try {
            const { data } = await axiosClient.delete(`/comments/${commentId}`, { data: { postId } });
            set(state => ({
                posts: state.posts.map(post =>
                    post._id === postId ? { ...post, comments: data?.data?.comments } : post
                ),
            }));
            toast.success("Comment deleted successfully");
            return data?.data?.comments;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting comment");
            return null;
        }
    },

    likeComment: async (postId, commentId, userId) => {
        if (!userId) {
            toast.error("Login required to like a comment");
            return null;
        }
        try {
            const { data } = await axiosClient.patch(`/comments/${commentId}/like`, { postId });
            set(state => ({
                posts: state.posts.map(post =>
                    post._id === postId ? { ...post, comments: data.data.comments } : post
                ),
            }));
            return data.data.comments;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error liking comment");
            return null;
        }
    },

    forceRefreshPosts: async () => {
        set({ loading: true, lastFetchTime: null });
        try {
            const { data } = await axiosClient.get('/posts');
            set({ posts: data.data, loading: false, lastFetchTime: Date.now() });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error refreshing posts");
        }
    },
}));

const handleInputErrors = (content, images) => {
    if (!content.trim() || images.length > 5) {
        toast.error(!content.trim() ? 'Content required' : 'Maximum 5 images allowed');
        return false;
    }
    return true;
};

const handleEditPostErrors = (content, newImages, existingImages) => {
    if (!content.trim() || newImages.length + existingImages.length > 5) {
        toast.error(!content.trim() ? 'Content required' : 'Maximum 5 images allowed');
        return false;
    }
    return true;
};

export default usePostZ;
