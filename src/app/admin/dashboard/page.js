"use client";

import LayoutHeader from '@/app/layoutHearTitle';
import { Box, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const Assignments = () => {
    const [chefs, setChefs] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const chefList = JSON.parse(localStorage.getItem("credentials")) || [];
        setChefs(chefList);

        const data = JSON.parse(localStorage.getItem("chefOrderDataList")) || [];
        const formattedOrders = data.map((order) => ({
            ...order,
            date: dayjs(order.date).format("YYYY-MM-DD"),
        }));

        setFilteredData(formattedOrders);
    }, []);

    // Initialize an empty object to store the assignments
    const assignments = chefs.reduce((acc, chef) => {
        if (chef.email) {
            acc[chef.email] = []; // Ensure each chef has an array for orders
        }
        return acc;
    }, {});

    // Distribute the orders
    filteredData.forEach((order, index) => {
        const chefIndex = index % chefs.length; // Determines which chef gets the order
        const chefEmail = chefs[chefIndex]?.email; // Safely access the chef's email
        if (chefEmail) {
            assignments[chefEmail].push(order); // Assign order to the chef
        }
    });

    const today = dayjs().format("YYYY-MM-DD");
    const todayOrders = filteredData.filter((item) => item.date === today)
    const todayOrdersCount = todayOrders.length > 0 ? todayOrders.length : 0;

    const AllOrders = filteredData.length > 0 ? filteredData.length : "0"
    return (
        <>
            <LayoutHeader pageTitle="Dashboard" />
            <Grid container spacing={2} className="!my-12 justify-center">
                {[
                    { icon: <LocalPharmacyIcon className="!text-7xl" />, label: "Today Orders", value: todayOrdersCount },
                    { icon: <MenuBookIcon className="!text-7xl" />, label: "All Orders", value: AllOrders },
                    { icon: <SoupKitchenIcon className="!text-7xl" />, label: "Complete", value: "100%" },
                ].map((item, index) => (
                    <Grid item xs={4} key={index}>
                        <Box className="bg-slate-950 hover:bg-red-700 text-white py-4 px-4">
                            <Typography className="flex justify-between pb-5">
                                <span>{item.icon}</span>
                                <span className="!text-2xl">
                                    <b>{item.value}</b>
                                    <ArrowDropUpIcon />
                                </span>
                            </Typography>
                            <Typography>{item.label}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={2} className="my-4">
                <Grid item xs={8}>
                    <Box
                        sx={{
                            border: 1,
                            height: 400,
                            borderRadius: 1,
                        }}
                    >
                        <span>{"Today's Orders"}</span>
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box
                        sx={{
                            border: 1,
                            height: 400,
                            borderRadius: 1,
                        }}
                    >
                        <span>All Orders</span>
                    </Box>
                </Grid>
            </Grid>

            <div className="container mx-auto p-6">
                <h1 className="text-2xl font-bold mb-4">Chef Order Assignments</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(assignments).map(([chef, chefOrders]) => (
                        <div
                            key={chef}
                            className="p-4 border rounded shadow-md bg-white text-gray-800"
                        >
                            <h2 className="text-xl font-semibold mb-2">{chef}</h2>
                            <ul>
                                {chefOrders.map((order, idx) => (
                                    <li key={idx} className="text-gray-700">
                                        <div>
                                            <strong>Date:</strong> {order.date}
                                        </div>
                                        <div>
                                            <strong>Items:</strong> {order.items?.join(', ') || "N/A"}
                                        </div>
                                        <div>
                                            <strong>Chefs:</strong> {order.chefs?.join(', ') || "N/A"}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Assignments;
