import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartDataItem {
    period: number;
    ts:number;
    bka:number;
    bkb:number;
}
interface LineChartProps {
    chartData: ChartDataItem[];
}
export const LineChart: React.FC<LineChartProps> = ({ chartData }) => {
    const data = {
        labels: chartData.map((item) => item.period), // Menggunakan periode sebagai label
        datasets: [
            {
                label: 'TS',
                data: chartData.map((item) => item.ts),
                borderColor: 'blue',
                borderWidth: 2,
                tension: 0.3,
            },
            {
                label: 'BKA',
                data: chartData.map((item) => item.bka),
                borderColor: 'orange',
                borderWidth: 2,
                tension: 0.3,
            },
            {
                label: 'BKB',
                data: chartData.map((item) => item.bkb),
                borderColor: 'gray',
                borderWidth: 2,
                tension: 0.3,
            },
        ],
    };

    const options = {
        height:300,
        width:200,
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const, // Pastikan tipe posisi adalah string literal
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <Line options={options} data={data} />;
};
