import React from 'react'
import StatsCard from '../stats/StatsCard'
import BarChart from '../charts/BarChart'
import { UserRound, UsersRound, Newspaper } from 'lucide-react'

const Overview = ({ chartOptions, accountsData, postsData, groupData }) => {
    const statsData = [
        {
            title: "Total Users",
            value: "500",
            icon: UserRound,
            change: "+1%"
        },
        {
            title: "Total Groups",
            value: "30",
            icon: UsersRound,
            change: "+1.2%"
        },
        {
            title: "Total Posts",
            value: "1,990",
            icon: Newspaper,
            change: "+1.84%"
        }
    ]

    return (
        <div className="p-6 space-y-6 md:pt-6 pt-20">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
                <BarChart
                    title="Account Growth"
                    data={accountsData}
                    options={chartOptions}
                />
                <BarChart
                    title="Post Engagement"
                    data={postsData}
                    options={chartOptions}
                />
                <BarChart
                    title="Group Statistics"
                    data={groupData}
                    options={chartOptions}
                />
            </div>
        </div>
    )
}

export default Overview
