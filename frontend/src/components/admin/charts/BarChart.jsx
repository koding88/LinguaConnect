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
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip as ChartTooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    ChartTooltip,
    Legend,
    Filler
);

const BarChart = ({
    title,
    subtitle,
    data,
    options,
    icon: Icon,
    color = "blue",
    delay = 0,
    description
}) => {
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
                }
            },
            tooltip: {
                ...options.plugins?.tooltip
            }
        },
        scales: {
            ...options.scales
        }
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
                            <div className="p-2 rounded-xl bg-gray-50 group-hover:scale-110 transition-transform duration-200">
                                <Icon className={`w-5 h-5 ${color}`} />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <CardTitle className={`text-lg font-semibold ${color}`}>
                                        {title}
                                    </CardTitle>
                                    {description && (
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Info className={`w-4 h-4 ${color}`} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p className={`${color}`}>{description}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    )}
                                </div>
                                {subtitle && (
                                    <p className={`text-sm ${color} opacity-70 transition-opacity group-hover:opacity-90`}>
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="relative h-[300px]">
                        <Bar data={data} options={chartOptions} />
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

export default BarChart
