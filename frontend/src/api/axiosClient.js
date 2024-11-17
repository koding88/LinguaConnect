import axios from 'axios';

const apiUrl = `${import.meta.env.VITE_API_BACKEND_URL}/api/v1`;

const axiosClient = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor
axiosClient.interceptors.request.use(function (config) {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.data.message === "Access token has expired" && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                const response = await axios.post(`${apiUrl}/auth/refresh-token`, { refreshToken });
                const { accessToken } = response.data.data;
                localStorage.setItem('access_token', accessToken);
                axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
