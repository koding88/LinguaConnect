import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import Overview from '@/components/admin/dashboard/Overview';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Dashboard = () => {
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    const accountsData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
            label: 'New Accounts',
            data: [100, 150, 200, 300, 250],
            backgroundColor: 'rgba(99, 132, 255, 0.8)',
            borderColor: 'rgb(99, 132, 255)',
            borderWidth: 1
        }]
    };

    const postsData = {
        labels: ['Images', 'Videos', 'Short Posts'],
        datasets: [
            {
                label: 'Likes',
                data: [300, 500, 200],
                backgroundColor: 'rgba(99, 132, 255, 0.8)',
                borderColor: 'rgb(99, 132, 255)',
                borderWidth: 1
            },
            {
                label: 'Comments',
                data: [70, 150, 50],
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
            },
            {
                label: 'Shares',
                data: [0, 80, 0],
                backgroundColor: 'rgba(255, 205, 86, 0.8)',
                borderColor: 'rgb(255, 205, 86)',
                borderWidth: 1
            }
        ]
    };

    const groupData = {
        labels: ['Group A', 'Group B', 'Group C', 'Group D'],
        datasets: [
            {
                label: 'Members',
                data: [200, 150, 300, 100],
                backgroundColor: 'rgba(255, 99, 132, 0.8)',
                borderColor: 'rgb(255, 99, 132)',
                borderWidth: 1
            },
            {
                label: 'Posts',
                data: [100, 80, 200, 50],
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgb(54, 162, 235)',
                borderWidth: 1
            }
        ]
    };

    return (
        <Overview
            chartOptions={chartOptions}
            accountsData={accountsData}
            postsData={postsData}
            groupData={groupData}
        />
    );
};

export default Dashboard;
