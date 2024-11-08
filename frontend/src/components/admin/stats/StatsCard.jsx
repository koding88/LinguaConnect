import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const StatsCard = ({ title, value, icon: Icon, change }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">{change}</span> from last month
                </p>
            </CardContent>
        </Card>
    )
}

export default StatsCard
