import React from 'react'
import { motion } from 'framer-motion'

const AdminPageLayout = ({ title, subtitle, children, icon: Icon }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex items-center gap-3 mb-2">
                    {Icon && <Icon className="w-8 h-8 text-blue-600" />}
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        {title}
                    </h1>
                </div>
                {subtitle && (
                    <p className="text-gray-500 text-sm">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {children}
            </div>
        </motion.div>
    )
}

export default AdminPageLayout
