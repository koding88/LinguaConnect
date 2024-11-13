import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from 'framer-motion'

const StatsCard = ({ title, value, icon: Icon, change, delay = 0 }) => {
    const isPositive = change.startsWith('+')

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card className="overflow-hidden">
                <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
                    <div className="p-2 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50">
                        <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                </CardHeader>

                <CardContent className="relative">
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        {value}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <span className={`font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                            {change}
                        </span>
                        from last month
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default StatsCard
