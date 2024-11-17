const StatusBadge = ({ status, variant = 'default' }) => {
    const variants = {
        default: {
            active: 'bg-green-100 text-green-800',
            inactive: 'bg-red-100 text-red-800'
        },
        post: {
            public: 'bg-green-100 text-green-800',
            private: 'bg-red-100 text-red-800'
        }
    }

    const getColorClass = () => {
        const variantColors = variants[variant]
        const statusKey = status.toLowerCase()
        return variantColors[statusKey] || 'bg-gray-100 text-gray-800'
    }

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getColorClass()}`}>
            {status}
        </span>
    )
}

export default StatusBadge
