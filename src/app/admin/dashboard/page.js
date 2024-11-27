"use client"
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

const Assignments = () => {
    const [chefs, setChef] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        const chefList = JSON.parse(localStorage.getItem("credentials")) || [];
        setChef(chefList);

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
        const chefIndex = index % chefs.length; //v Determines which chef gets the order
        const chefEmail = chefs[chefIndex]?.email; // Safely access the chef's email
        if (chefEmail) {
            assignments[chefEmail].push(order); // Assign order to the chef
        }
    });

    return (
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
                                    <div><strong>Date:</strong> {order.date}</div>
                                    <div><strong>Items:</strong> {order.items.join(', ')}</div>
                                    <div><strong>Chefs:</strong> {order.chefs.join(', ')}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Assignments;
