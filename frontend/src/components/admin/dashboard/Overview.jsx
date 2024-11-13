import React from 'react'
import StatsCard from '../stats/StatsCard'
import BarChart from '../charts/BarChart'
import {
    UserRound, UsersRound, Newspaper,
    TrendingUp, Activity, Target,
    Users,
    UserPlus, BarChart2,
    ThumbsUp, MessageCircle, Share2,
    Video, FileText, Camera,
    Users2, MessagesSquare, Flame
} from 'lucide-react'


// Import Chart.js registers
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const Overview = ({ chartOptions, accountsData, postsData, groupData }) => {
    const statsData = [
        {
            title: "Total Users",
            value: "500",
            icon: UserRound,
            change: "+1%",
            description: "Active users this month",
            color: "blue"
        },
        {
            title: "Total Groups",
            value: "30",
            icon: UsersRound,
            change: "+1.2%",
            description: "Active groups this month",
            color: "purple"
        },
        {
            title: "Total Posts",
            value: "1,990",
            icon: Newspaper,
            change: "+1.84%",
            description: "Posts created this month",
            color: "pink"
        }
    ]

    const enhancedAccountsData = {
        labels: ['January', 'February', 'March', 'April', 'May'],
        datasets: [{
            label: 'New Users',
            data: [100, 150, 200, 300, 250],
            type: 'line', // Line chart for trend visualization
            borderColor: 'rgba(37, 99, 235, 1)',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4, // Smooth curve
            icon: UserPlus,
            pointBackgroundColor: 'rgba(37, 99, 235, 1)',
            pointRadius: 4,
            pointHoverRadius: 6,
        }]
    }

    const enhancedPostsData = {
        labels: [
            { text: 'Images', icon: Camera },
            { text: 'Videos', icon: Video },
            { text: 'Text Posts', icon: FileText }
        ],
        datasets: [
            {
                label: 'Likes',
                data: [300, 500, 200],
                icon: ThumbsUp,
                stack: 'stack1',
            },
            {
                label: 'Comments',
                data: [70, 150, 50],
                icon: MessageCircle,
                stack: 'stack1',
            },
            {
                label: 'Shares',
                data: [50, 80, 30],
                icon: Share2,
                stack: 'stack1',
            }
        ]
    }

    const enhancedGroupData = {
        labels: [
            { text: 'Language Exchange', icon: MessagesSquare },
            { text: 'Study Groups', icon: Users2 },
            { text: 'Cultural Exchange', icon: Users },
            { text: 'Practice Partners', icon: Users2 }
        ],
        datasets: [
            {
                type: 'bar',
                label: 'Members',
                data: [200, 150, 300, 100],
                icon: Users,
                yAxisID: 'y',
            },
            {
                type: 'line',
                label: 'Activity Score',
                data: [85, 65, 90, 45],
                borderColor: 'rgba(236, 72, 153, 1)',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                yAxisID: 'y1',
                tension: 0.4,
                icon: Activity,
            }
        ]
    }

    const trendingPostsData = {
        labels: [
            "Learning English Grammar Tips",
            "Cultural Exchange Stories",
            "Speaking Practice Guide",
            "Vocabulary Building Hacks",
            "Pronunciation Tips"
        ],
        datasets: [
            {
                type: 'bar',
                label: 'Likes',
                data: [245, 190, 160, 140, 120],
                icon: ThumbsUp,
                backgroundColor: 'rgba(37, 99, 235, 0.8)',
                borderColor: 'rgba(37, 99, 235, 1)',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 12,
            },
            {
                type: 'bar',
                label: 'Comments',
                data: [180, 150, 130, 100, 80],
                icon: MessageCircle,
                backgroundColor: 'rgba(147, 51, 234, 0.8)',
                borderColor: 'rgba(147, 51, 234, 1)',
                borderWidth: 2,
                borderRadius: 8,
                barThickness: 12,
            }
        ]
    }

    const chartConfigs = {
        accountGrowth: {
            title: "Account Growth",
            subtitle: "Monthly user registration trend",
            description: "Track new user registrations over time",
            icon: TrendingUp,
            color: "blue",
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of New Users'
                        }
                    }
                }
            }
        },
        postEngagement: {
            title: "Content Engagement",
            subtitle: "Interaction metrics by content type",
            description: "Compare engagement across different content formats",
            icon: BarChart2,
            color: "purple",
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Number of Interactions'
                        }
                    },
                    x: {
                        stacked: true
                    }
                }
            }
        },
        groupActivity: {
            title: "Group Performance",
            subtitle: "Member count and activity metrics",
            description: "Monitor group growth and engagement levels",
            icon: Target,
            color: "pink",
            options: {
                ...chartOptions,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Number of Members'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'Activity Score'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        },
        trendingPosts: {
            title: "Trending Posts",
            subtitle: "Top 5 most engaging posts",
            description: "Posts with highest engagement in the last 7 days",
            icon: Flame,
            color: "purple",
            options: {
                ...chartOptions,
                indexAxis: 'y', // Horizontal bar chart
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Number of Interactions'
                        }
                    },
                    y: {
                        stacked: true,
                        ticks: {
                            callback: function(value) {
                                const label = this.getLabelForValue(value);
                                // Truncate long labels
                                return label.length > 25 ? label.substr(0, 25) + '...' : label;
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: (context) => {
                                // Show full title in tooltip
                                return trendingPostsData.labels[context[0].dataIndex];
                            }
                        }
                    }
                }
            }
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} delay={index * 0.1} />
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid gap-6 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
                <BarChart
                    {...chartConfigs.accountGrowth}
                    data={enhancedAccountsData}
                />
                <BarChart
                    {...chartConfigs.postEngagement}
                    data={enhancedPostsData}
                />
                <BarChart
                    {...chartConfigs.groupActivity}
                    data={enhancedGroupData}
                />
                <BarChart
                    {...chartConfigs.trendingPosts}
                    data={trendingPostsData}
                />
            </div>
        </div>
    )
}

export default Overview
