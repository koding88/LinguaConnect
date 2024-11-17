import StatsCard from '../stats/StatsCard'
import BarChart from '../charts/BarChart'
import {
    UserRound, UsersRound, Newspaper,
    TrendingUp, Target,
    UserPlus, BarChart2,
    ThumbsUp, MessageCircle,
    FileText,
    Flame
} from 'lucide-react'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
import useDashboard from '@/zustand/useDashboard';

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

const Overview = () => {
    const navigate = useNavigate();
    const {
        getTotalSystems,
        dashboardData,
        getMonthlyUserRegistrationTrend,
        monthlyUserRegistrationTrend,
        getContentTypeMetrics,
        contentTypeMetrics,
        getTop3GroupsMostMembers,
        top3GroupsMostMembers,
        getTop5TrendingPosts,
        top5TrendingPosts
    } = useDashboard();
    const { users, groups, posts } = dashboardData || {};

    useEffect(() => {
        getTotalSystems();
        getMonthlyUserRegistrationTrend();
        getContentTypeMetrics();
        getTop3GroupsMostMembers();
        getTop5TrendingPosts();
    }, [
        getTotalSystems,
        getMonthlyUserRegistrationTrend,
        getContentTypeMetrics,
        getTop3GroupsMostMembers,
        getTop5TrendingPosts
    ]);

    // Helper function to get month name
    const getMonthName = (monthNumber) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[monthNumber - 1];
    };

    // Helper function to format content type labels
    const formatContentType = (type) => {
        const labels = {
            'images_only': 'Images Only',
            'text_only': 'Text Only',
            'text_and_images': 'Text & Images'
        };
        return labels[type] || type;
    };

    const statsData = [
        {
            title: "Total Users",
            value: users,
            icon: UserRound,
            description: "Active users",
            color: "blue"
        },
        {
            title: "Total Groups",
            value: groups,
            icon: UsersRound,
            description: "Active groups",
            color: "purple"
        },
        {
            title: "Total Posts",
            value: posts,
            icon: Newspaper,
            description: "Total posts",
            color: "pink"
        }
    ]

    const enhancedAccountsData = {
        labels: monthlyUserRegistrationTrend?.map(item => getMonthName(item._id.month)) || [],
        datasets: [{
            label: 'New Users',
            data: monthlyUserRegistrationTrend?.map(item => item.count) || [],
            type: 'line',
            borderColor: 'rgba(37, 99, 235, 1)',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4,
            icon: UserPlus,
            pointBackgroundColor: 'rgba(37, 99, 235, 1)',
            pointRadius: 4,
            pointHoverRadius: 6,
        }]
    }

    const contentEngagementColors = {
        posts: {
            background: 'rgba(147, 51, 234, 0.9)',  // Purple
            border: 'rgba(147, 51, 234, 1)', 
            hover: 'rgba(147, 51, 234, 0.7)',
            text: '#9333EA'  // Solid color for text/icon
        },
        likes: {
            background: 'rgba(236, 72, 153, 0.9)', // Pink
            border: 'rgba(236, 72, 153, 1)',
            hover: 'rgba(236, 72, 153, 0.7)', 
            text: '#EC4899'  // Solid color for text/icon
        },
        comments: {
            background: 'rgba(59, 130, 246, 0.9)',  // Blue
            border: 'rgba(59, 130, 246, 1)',
            hover: 'rgba(59, 130, 246, 0.7)',
            text: '#3B82F6'  // Solid color for text/icon
        }
    };

    const enhancedPostsData = {
        labels: contentTypeMetrics?.map(item => formatContentType(item.contentType)) || [],
        datasets: [
            {
                type: 'bar',
                label: 'Posts',
                data: contentTypeMetrics?.map(item => item.count) || [],
                icon: FileText,
                backgroundColor: contentEngagementColors.posts.background,
                borderColor: contentEngagementColors.posts.border,
                hoverBackgroundColor: contentEngagementColors.posts.hover,
                borderWidth: 1,
                borderRadius: 0,
                barThickness: 25,
                labelColor: contentEngagementColors.posts.text,
                iconColor: contentEngagementColors.posts.text
            },
            {
                type: 'bar',
                label: 'Likes',
                data: contentTypeMetrics?.map(item => item.likes) || [],
                icon: ThumbsUp,
                backgroundColor: contentEngagementColors.likes.background,
                borderColor: contentEngagementColors.likes.border,
                hoverBackgroundColor: contentEngagementColors.likes.hover,
                borderWidth: 1,
                borderRadius: 0,
                barThickness: 25,
                labelColor: contentEngagementColors.likes.text,
                iconColor: contentEngagementColors.likes.text
            },
            {
                type: 'bar',
                label: 'Comments',
                data: contentTypeMetrics?.map(item => item.comments) || [],
                icon: MessageCircle,
                backgroundColor: contentEngagementColors.comments.background,
                borderColor: contentEngagementColors.comments.border,
                hoverBackgroundColor: contentEngagementColors.comments.hover,
                borderWidth: 1,
                borderRadius: 0,
                barThickness: 25,
                labelColor: contentEngagementColors.comments.text,
                iconColor: contentEngagementColors.comments.text
            }
        ]
    }

    const groupColors = {
        bar1: {
            background: 'rgba(34, 197, 94, 0.9)', // Green
            border: 'rgba(34, 197, 94, 1)',
            hover: 'rgba(34, 197, 94, 0.7)', 
            text: '#22C55E'
        },
        bar2: {
            background: 'rgba(236, 72, 153, 0.9)', // Pink
            border: 'rgba(236, 72, 153, 1)',
            hover: 'rgba(236, 72, 153, 0.7)',
            text: '#EC4899'
        },
        bar3: {
            background: 'rgba(59, 130, 246, 0.9)', // Blue
            border: 'rgba(59, 130, 246, 1)',
            hover: 'rgba(59, 130, 246, 0.7)',
            text: '#3B82F6'
        },
    };

    const enhancedGroupData = {
        labels: top3GroupsMostMembers?.map(group => group.name) || [],
        datasets: [
            {
                type: 'bar',
                label: 'Members',
                data: top3GroupsMostMembers?.map(group => group.members) || [],
                backgroundColor: [
                    groupColors.bar1.background,
                    groupColors.bar2.background,
                    groupColors.bar3.background
                ],
                borderColor: [
                    groupColors.bar1.border,
                    groupColors.bar2.border,
                    groupColors.bar3.border
                ],
                hoverBackgroundColor: [
                    groupColors.bar1.hover,
                    groupColors.bar2.hover,
                    groupColors.bar3.hover
                ],
                borderWidth: 1,
                borderRadius: 0,
                barThickness: 40,
                labelColor: '#9333EA',
            }
        ]
    };

    const trendingPostsData = {
        labels: top5TrendingPosts?.map(post => post.title) || [],
        datasets: [
            {
                type: 'bar',
                label: 'Likes',
                data: top5TrendingPosts?.map(post => post.likes) || [],
                icon: ThumbsUp,
                backgroundColor: 'rgba(59, 130, 246, 0.9)', // Blue
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
                borderRadius: 0,
                barThickness: 20,
            },
            {
                type: 'bar',
                label: 'Comments',
                data: top5TrendingPosts?.map(post => post.comments) || [],
                icon: MessageCircle,
                backgroundColor: 'rgba(147, 51, 234, 0.9)', // Purple
                borderColor: 'rgba(147, 51, 234, 1)',
                borderWidth: 1,
                borderRadius: 0,
                barThickness: 20,
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
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of New Users'
                        },
                        ticks: {
                            stepSize: 1, // Since we're counting users, use whole numbers
                            precision: 0
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => `New Users: ${context.parsed.y}`
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
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Interactions',
                            font: {
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            precision: 0
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.dataset.label;
                                const value = context.parsed.y;
                                return `${label}: ${value.toLocaleString()}`;
                            }
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12,
                        displayColors: true,
                        boxWidth: 10,
                        boxHeight: 10,
                        usePointStyle: false
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: false,
                            padding: 20,
                            boxWidth: 12,
                            boxHeight: 12,
                            font: {
                                size: 12
                            },
                            color: (context) => context.dataset.labelColor || '#4B5563',
                            generateLabels: (chart) => {
                                const datasets = chart.data.datasets;
                                return datasets.map((dataset, i) => ({
                                    text: dataset.label,
                                    fillStyle: dataset.backgroundColor,
                                    strokeStyle: dataset.borderColor,
                                    lineWidth: dataset.borderWidth,
                                    hidden: !chart.isDatasetVisible(i),
                                    index: i,
                                    fontColor: dataset.labelColor,
                                    datasetIndex: i
                                }));
                            }
                        }
                    }
                },
                barPercentage: 0.9,
                categoryPercentage: 0.8,
                maintainAspectRatio: false
            }
        },
        groupActivity: {
            title: "Top Groups by Members",
            subtitle: "Groups with most members",
            description: "Top 3 groups with highest member count",
            icon: Target,
            color: "text-purple-600",
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Number of Members',
                            font: {
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            precision: 0
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            callback: function(value) {
                                const label = this.getLabelForValue(value);
                                return label.length > 20 ? label.substr(0, 20) + '...' : label;
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: (context) => {
                                // Show full group name in tooltip
                                return top3GroupsMostMembers[context[0].dataIndex].name;
                            },
                            label: (context) => {
                                return `Members: ${context.parsed.y}`;
                            }
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12
                    },
                    legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                            color: '#9333EA',
                            usePointStyle: false,
                            padding: 20,
                            boxWidth: 12,
                            boxHeight: 12,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                },
                barPercentage: 0.8,
                categoryPercentage: 0.9,
                maintainAspectRatio: false
            }
        },
        trendingPosts: {
            title: "Trending Posts",
            subtitle: "Top 5 most engaging posts",
            description: "Posts with highest engagement in the last 7 days",
            icon: Flame,
            color: "text-purple-600",
            options: {
                indexAxis: 'y',
                responsive: true,
                scales: {
                    x: {
                        stacked: true,
                        title: {
                            display: true,
                            text: 'Number of Interactions',
                            font: {
                                weight: 'bold'
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)',
                            drawBorder: false
                        }
                    },
                    y: {
                        stacked: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            callback: function(value) {
                                const label = this.getLabelForValue(value);
                                return label.length > 25 ? label.substr(0, 25) + '...' : label;
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            title: (context) => {
                                return top5TrendingPosts[context[0].dataIndex].title;
                            },
                            label: (context) => {
                                const label = context.dataset.label;
                                const value = context.parsed.x;
                                return `${label}: ${value}`;
                            }
                        },
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        titleColor: '#1f2937',
                        bodyColor: '#4b5563',
                        borderColor: '#e5e7eb',
                        borderWidth: 1,
                        padding: 12
                    },
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: false,
                            padding: 20,
                            boxWidth: 12,
                            boxHeight: 12,
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                },
                onClick: (event, elements) => {
                    if (elements && elements.length > 0) {
                        const index = elements[0].index;
                        const postId = top5TrendingPosts[index]._id;
                        navigate(`/admin/manage/posts/${postId}`);
                    }
                },
                onHover: (event, elements) => {
                    event.native.target.style.cursor = elements?.length > 0 ? 'pointer' : 'default';
                },
                maintainAspectRatio: false
            }
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                {statsData.map((stat, index) => (
                    <StatsCard key={index} {...stat} delay={index * 0.1} />
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid gap-8 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1">
                <BarChart
                    {...chartConfigs.accountGrowth}
                    data={enhancedAccountsData}
                    color='text-blue-600'
                />
                <BarChart
                    {...chartConfigs.postEngagement}
                    data={enhancedPostsData}
                    chartColors={contentEngagementColors}
                    color='text-purple-600'
                />
                <BarChart
                    {...chartConfigs.groupActivity}
                    data={enhancedGroupData}
                    color='text-purple-600'
                />
                <BarChart
                    {...chartConfigs.trendingPosts}
                    data={trendingPostsData}
                    color='text-purple-600'
                />
            </div>
        </div>
    )
}

export default Overview
