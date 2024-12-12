import { create } from 'zustand'
import axiosClient from '@/api/axiosClient'
import { toast } from 'react-toastify'

const useGroupZ = create((set) => ({
    groups: [],
    group: null,
    groupPosts: [],
    loading: false,
    error: null,

    resetGroupPosts: () => {
        set({ groupPosts: [] });
    },

    getGroups: async () => {
        set({ loading: true });
        try {
            const response = await axiosClient.get('/groups');
            const groupsData = response.data.data
            set({ groups: groupsData, loading: false });
        } catch (error) {
            set({ loading: false, error: error.message });
        }
    },

    getGroup: async (groupId) => {
        set({ loading: true, groupPosts: [], group: null });
        try {
            const { data } = await axiosClient.get(`/groups/${groupId}`);
            set({ group: data.data, loading: false })
        } catch (error) {
            set({ loading: false, error: error.message });
            // toast.error(error.response?.data?.message || "Error getting group");
        }
    },

    createGroup: async (name, description) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.post('/groups', { name, description });
            set(state => ({ groups: [data.data, ...state.groups], loading: false }));
            toast.success(data.message);
            return data.data
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error creating group");
        }
    },

    editGroup: async (groupId, name, description) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.put(`/groups/${groupId}`, { name, description });
            set({ loading: false });
            toast.success(data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error editing group");
        }
    },

    searchGroup: async (searchTerm) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.get(`/groups/search?searchTerm=${searchTerm}`);
            set({ groups: data.data, loading: false })
            return data.data
        } catch (error) {
            set({ loading: false, error: error.message });
            toast.error(error.response?.data?.message || "Error searching group");
        }
    },

    joinGroup: async (groupId) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.post(`/groups/join/${groupId}`);
            set(state => ({ groups: state.groups.map(group => group._id === groupId ? data.data : group) }));
            toast.success(data.message);
            return data.data
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error joining group");
        }
    },

    leaveGroup: async (groupId) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.post(`/groups/leave/${groupId}`);
            set({ loading: false });
            toast.success(data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error leaving group");
        }
    },

    updateMaxMembers: async (groupId, maxMembers) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.patch(`/groups/settings/limit-members/${groupId}`, { maxMembers });
            set(state => ({ group: { ...state.group, maxMembers } }));
            set({ loading: false });
            toast.success(data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error updating member limit");
        }
    },

    deleteGroup: async (groupId) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.delete(`/groups/${groupId}`);
            set({ loading: false });
            toast.success(data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error deleting group");
        }
    },

    updateAvatarGroup: async (formData, groupId) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.patch(`/groups/settings/avatar/${groupId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set({ loading: false });
            toast.success(data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error updating avatar group");
        }
    },

    removeMember: async (groupId, memberId) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.post(`/groups/settings/remove-member/${groupId}`, { memberId });
            set(state => ({
                group: {
                    ...state.group,
                    members: state.group.members.filter(member => member._id !== memberId)
                }
            }));
            set({ loading: false });
            toast.success(data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error removing member");
        }
    },

    getGroupPosts: async (groupId) => {
        set({ loading: true })
        try {
            const { data } = await axiosClient.get(`/groups/${groupId}/posts`);
            set({ groupPosts: data.data, loading: false })
        } catch (error) {
            set({ loading: false, error: error.message });
            // toast.error(error.response?.data?.message || "Error getting group posts");
        }
    },

    createGroupPost: async (groupId, content, images) => {
        set({ loading: true });
        try {
            const formData = new FormData();
            formData.append('content', content);
            images.forEach(image => formData.append('files', image));
            const { data } = await axiosClient.post(`/groups/${groupId}/posts`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set(state => ({ group: { ...state.group, posts: [data.data, ...state.group.posts] } }));
            toast.success(data.message);
            return data.data
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error creating group post");
        }
    },

    editGroupPost: async (groupId, postId, content, newImages = [], existingImages = [], originalImages = []) => {
        set({ loading: true });
        try {
            const formData = new FormData();
            formData.append('content', content);
            newImages.forEach(image => formData.append('files', image));
            originalImages.filter(url => !existingImages.includes(url)).forEach(url => formData.append('urls', url));
            const { data } = await axiosClient.patch(`/groups/${groupId}/posts/${postId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            set(state => ({ groupPosts: { ...state.groupPosts, posts: state.groupPosts?.posts?.map(post => post._id === postId ? data.data : post) } }));
            toast.success(data.message);
            return data.data;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error editing group post");
        }
    },

    deleteGroupPost: async (groupId, postId) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.delete(`/groups/${groupId}/posts/${postId}`);
            set(state => ({ groupPosts: { ...state.groupPosts, posts: state.groupPosts?.posts?.filter(post => post._id !== postId) }, loading: false }));
            toast.success(data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error deleting group post");
        }
    },

    reportPostGroup: async (groupId, postId) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.patch(`/groups/${groupId}/posts/${postId}/report`);
            set(state => ({
                groupPosts: {
                    ...state.groupPosts,
                    posts: state.groupPosts?.posts?.map(post =>
                        post._id === postId ? data.data : post
                    )
                },
                loading: false
            }));
            toast.success(data.message);
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error reporting group post");
        }
    },

    addCommentGroupPost: async (groupId, postId, content) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.post(`/groups/${groupId}/posts/${postId}/comments`, { content });
            set(state => ({
                groupPosts: {
                    ...state.groupPosts,
                    posts: state.groupPosts.posts?.map(post =>
                        post._id === postId ? data.data : post
                    )
                }
            }));
            toast.success(data.message);
            return data.data.comments;
        } catch (error) {
            console.log(error)
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error commenting group post");
            return null;
        }
    },

    editCommentGroupPost: async (groupId, postId, commentId, content) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.patch(`/groups/${groupId}/posts/${postId}/comments/${commentId}`, { content });
            set(state => ({
                groupPosts: {
                    ...state.groupPosts,
                    posts: state.groupPosts.posts?.map(post => post._id === postId ? data.data : post)
                }
            }));
            console.log('data', data)
            toast.success(data.message);
            return data.data.comments;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error editing comment group post");
        }
    },

    deleteCommentGroupPost: async (groupId, postId, commentId) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.delete(`/groups/${groupId}/posts/${postId}/comments/${commentId}`);
            set(state => ({
                groupPosts: {
                    ...state.groupPosts,
                    posts: state.groupPosts.posts?.map(post => post._id === postId ? data.data : post)
                }
            }));
            toast.success(data.message);
            return data.data.comments;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error deleting comment group post");
        }
    },

    likeGroupComment: async (groupId, postId, commentId) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.patch(`/groups/${groupId}/posts/${postId}/comments/${commentId}/like`);
            set(state => ({
                groupPosts: {
                    ...state.groupPosts,
                    posts: state.groupPosts.posts?.map(post => post._id === postId ? data.data : post)
                }
            }));
            return data.data.comments;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error liking comment group post");
        }
    },

    likeGroupPost: async (groupId, postId) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.patch(`/groups/${groupId}/posts/${postId}/like`);
            set(state => ({ groupPosts: { ...state.groupPosts.posts, posts: state.groupPosts?.posts?.map(post => post._id === postId ? data.data : post) } }));
            set({ loading: false });
            return data.data.likes;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error liking group post");
            return null;
        }
    },

    getGroupPostById: async (groupId, postId) => {
        set({ loading: true });
        try {
            const { data } = await axiosClient.get(`/groups/${groupId}/posts/${postId}`);
            set({ groupPost: data.data, loading: false })
            return data.data
        } catch (error) {
            set({ loading: false, error: error.message });
            toast.error(error.response?.data?.message || "Error getting group post");
        }
    },
}))

export default useGroupZ;
