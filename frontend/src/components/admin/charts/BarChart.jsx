import React from 'react'
import { motion } from 'framer-motion'
import { Bar } from "react-chartjs-2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const BarChart = ({ title, subtitle, data, options, icon: Icon, color = "blue", delay = 0, description }) => {
    const gradientColors = {
        blue: {
            primary: 'rgba(37, 99, 235, 0.8)',
            secondary: 'rgba(96, 165, 250, 0.8)',
            background: 'rgba(37, 99, 235, 0.1)',
            border: 'rgba(37, 99, 235, 1)',
            text: "text-blue-600",
            light: "bg-blue-50"
        },
        purple: {
            primary: 'rgba(147, 51, 234, 0.8)',
            secondary: 'rgba(192, 132, 252, 0.8)',
            background: 'rgba(147, 51, 234, 0.1)',
            border: 'rgba(147, 51, 234, 1)',
            text: "text-purple-600",
            light: "bg-purple-50"
        },
        pink: {
            primary: 'rgba(236, 72, 153, 0.8)',
            secondary: 'rgba(249, 168, 212, 0.8)',
            background: 'rgba(236, 72, 153, 0.1)',
            border: 'rgba(236, 72, 153, 1)',
            text: "text-pink-600",
            light: "bg-pink-50"
        }
    }

    const colors = gradientColors[color]

    const chartOptions = {
        ...options,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    generateLabels: (chart) => {
                        const datasets = chart.data.datasets;
                        return datasets.map((dataset, i) => ({
                            text: dataset.label,
                            fillStyle: dataset.backgroundColor,
                            strokeStyle: dataset.borderColor,
                            lineWidth: 2,
                            hidden: !chart.isDatasetVisible(i),
                            index: i,
                            datasetIndex: i
                        }));
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#1f2937',
                bodyColor: '#4b5563',
                borderColor: colors.border,
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    title: (tooltipItems) => {
                        const label = data.labels[tooltipItems[0].dataIndex];
                        return typeof label === 'object' ? label.text : label;
                    },
                    label: (context) => {
                        const dataset = context.dataset;
                        const value = context.parsed.y;
                        return `${dataset.label}: ${value}`;
                    },
                    labelPointStyle: (context) => {
                        const dataset = context.dataset;
                        if (dataset.icon) {
                            return {
                                pointStyle: 'circle'
                            };
                        }
                        return {};
                    }
                }
            }
        },
        scales: {
            ...options.scales,
            x: {
                ...options.scales?.x,
                ticks: {
                    ...options.scales?.x?.ticks,
                    callback: function(value) {
                        const label = this.getLabelForValue(value)
                        return typeof label === 'object' ? label.text : label
                    }
                }
            }
        }
    }

    const enhancedData = {
        ...data,
        datasets: data.datasets.map((dataset) => {
            if (dataset.type === 'line') {
                return {
                    ...dataset,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                }
            }

            const gradient = (context) => {
                const chart = context.chart
                const { ctx, chartArea } = chart
                if (!chartArea) return null

                const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top)
                gradient.addColorStop(0, colors.primary)
                gradient.addColorStop(1, colors.secondary)
                return gradient
            }

            return {
                ...dataset,
                backgroundColor: gradient,
                borderColor: colors.border,
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: colors.background,
                barThickness: 12,
            }
        })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
        >
            <Card className="overflow-hidden group">
                <CardHeader className="border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${colors.light} group-hover:scale-110 transition-transform duration-200`}>
                                <Icon className={`w-5 h-5 ${colors.text}`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                        {title}
                                    </CardTitle>
                                    {description && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className="w-4 h-4 text-gray-400" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                                {subtitle && (
                                    <p className="text-sm text-gray-500">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="relative h-[300px]">
                        <Bar data={enhancedData} options={chartOptions} />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default BarChart
