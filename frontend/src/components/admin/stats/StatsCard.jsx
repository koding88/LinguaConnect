import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"

const StatsCard = ({ title, value, icon: Icon, description, color = "blue", delay = 0 }) => {
    const colorVariants = {
        blue: {
            background: "bg-blue-50",
            text: "text-blue-600",
            gradient: "from-blue-600 to-blue-400"
        },
        purple: {
            background: "bg-purple-50",
            text: "text-purple-600",
            gradient: "from-purple-600 to-purple-400"
        },
        pink: {
            background: "bg-pink-50",
            text: "text-pink-600",
            gradient: "from-pink-600 to-pink-400"
        }
    }

    const colors = colorVariants[color]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card className="group hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                                {title}
                            </p>
                            <div className="flex items-baseline space-x-2">
                                <h2 className={`text-3xl font-bold bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent`}>
                                    {value || 0}
                                </h2>
                            </div>
                            {description && (
                                <p className="text-sm text-gray-500">
                                    {description}
                                </p>
                            )}
                        </div>
                        <div className={`p-3 rounded-xl ${colors.background} group-hover:scale-110 transition-transform duration-200`}>
                            <Icon className={`w-6 h-6 ${colors.text}`} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default StatsCard
