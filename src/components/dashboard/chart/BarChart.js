import React, { useEffect, useRef } from "react";
import {
    Chart,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import dayjs from "dayjs";

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function BarChart({ data }) {
    const chartRef = useRef(null); // Ref to store the chart instance

    useEffect(() => {
        const today = dayjs().format("YYYY-MM-DD");

        const allOrdersCount = data?.allOrders?.length || 0;
        const deliveredOrdersCount = data?.delivered?.length || 0;

        // Filter for today's orders
        const todayOrdersCount = data?.allOrders?.filter(order =>
            dayjs(order.date).format("YYYY-MM-DD") === today
        ).length || 0;


        const ctx = document.getElementById("myChart").getContext("2d");

        // Destroy the previous chart instance if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Create a new chart instance and store it in the ref
        chartRef.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["All Orders", "Delivered Orders", "Today Orders"],
                datasets: [
                    {
                        data: [allOrdersCount, deliveredOrdersCount, todayOrdersCount],
                        label: "Orders",
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.5)", // Color for All Orders
                            "rgba(54, 162, 235, 0.5)", // Color for Delivered Orders
                            "rgba(75, 192, 192, 0.5)", // Color for Today Orders
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)", // Border color for All Orders
                            "rgba(54, 162, 235, 1)", // Border color for Delivered Orders
                            "rgba(75, 192, 192, 1)", // Border color for Today Orders
                        ],
                        borderWidth: 2,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                    title: {
                        display: true,
                        text: "Orders Overview",
                    },
                },
            },
        });

        // Cleanup function to destroy the chart when the component unmounts
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, [data]);

    return (
        <div className="w-[1000px] h-screen flex mx-auto my-auto">
            <div className="border border-gray-400 pt-0 rounded-xl w-full h-fit my-auto shadow-xl">
                <canvas id="myChart"></canvas>
            </div>
        </div>
    );
}

export default BarChart;
