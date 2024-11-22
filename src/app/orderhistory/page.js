"use client";

import React, { useEffect, useState } from "react";
import LayoutHeader from "../layoutHearTitle";
import { List, ListItem, ListItemIcon, ListItemText, Avatar, Box, Divider } from "@mui/material";
import dayjs from 'dayjs';
export default function OrderHistory() {
    const [myOrder, setMyOrder] = useState([]);

    useEffect(() => {
        // Fetch orders from localStorage
        const ordersData = JSON.parse(localStorage.getItem("myOrders")) || [];

        // Ensure each order.date is parsed as a dayjs object
        const formattedOrders = ordersData?.map(order => ({
            ...order,
            date: dayjs(order.date) // Parse date to dayjs
        }));

        setMyOrder(formattedOrders);
    }, []);

    console.log("first", myOrder);

    return (
        <>
            <LayoutHeader pageTitle="Order History" />
            {myOrder.length > 0 ? (
                <Box
                    sx={{
                        maxWidth: "lg",
                        boxShadow: 3,
                        borderRadius: 2,
                        padding: 4,
                        backgroundColor: "white",
                        margin: "0 auto",
                    }}
                >
                    <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">Order History</h2>
                    <List>
                        {myOrder.map((order, index) => (
                            <div key={index} className="mb-8 shadow-xl pb-4">
                                {/* Displaying Order Date */}
                                <div className="mb-4 text-xl font-medium text-gray-600">
                                    <strong>Order Date:</strong> {order.date.format('YYYY-MM-DD HH:mm:ss')}
                                </div>

                                {/* Items in the current order */}
                                <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
                                    {order.items.map((item) => (
                                        <ListItem key={item.id} disablePadding className="py-4">
                                            <ListItemIcon>
                                                <Avatar alt={item.name} src={item.image} />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <span className="font-semibold text-gray-700">{item.name}</span>
                                                }
                                                secondary={
                                                    <div className="text-gray-500 text-sm">
                                                        Type: <span className="font-medium">{item.type}</span> | Price: <span className="font-medium">${item.price}</span> | Quantity: <span className="font-medium">{item.quantity}</span>
                                                    </div>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </div>
                                {/* <Divider sx={{ borderBottom: '2px solid #333', marginY: 2 }} /> */}
                            </div>
                        ))}
                    </List>

                </Box>
            ) : (
                <p className="text-center text-xl text-gray-600 mt-6">No orders found.</p>
            )}
        </>
    );
}
