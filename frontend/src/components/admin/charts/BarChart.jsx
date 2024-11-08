import React from 'react'
import { Bar } from "react-chartjs-2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const BarChart = ({ title, data, options }) => {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Bar data={data} options={options} />
            </CardContent>
        </Card>
    )
}

export default BarChart
