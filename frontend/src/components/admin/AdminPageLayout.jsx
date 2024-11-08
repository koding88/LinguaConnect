import React from 'react'

const AdminPageLayout = ({ title, children }) => {
    return (
        <div className="p-6 space-y-6 md:pt-6 pt-20">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {children}
        </div>
    )
}

export default AdminPageLayout
