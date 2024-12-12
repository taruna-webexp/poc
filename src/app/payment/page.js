"use client";

import React, { useState, useEffect } from "react";
import LayoutHeader from "../layoutHearTitle";
import { successMsg } from "@/components/msg/toaster";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function Payment() {
    const [orderData, setOrderData] = useState([]);
    const [isClient, setIsClient] = useState(false); // To check if it's on the client side
    const [uniqueNumber, setUniqueNumber] = useState(null);
    const [chefs, setChef] = useState([]);
    const [orderUpdateData, setOrderUpdateData] = useState([]);

    useEffect(() => {
        const chefList = JSON.parse(localStorage.getItem("credentials")) || [];
        setChef(chefList);
    }, [])

    useEffect(() => {
        // Retrieve the current number from localStorage or initialize to 1001
        let currentNumber = localStorage.getItem('uniqueNumber');
        if (!currentNumber) {
            currentNumber = 1000; // Set initial value if not already set
        } else {
            currentNumber = parseInt(currentNumber, 10) + 1; // Increment the number
        }

        localStorage.setItem('uniqueNumber', currentNumber);  // Save the new number to localStorage
        setUniqueNumber(currentNumber);    // Update state to reflect the new unique number
    }, []);


    useEffect(() => {
        // Ensure this runs only on the client side
        setIsClient(true);
        const savedData = localStorage.getItem("orderplaceList");
        if (savedData) {
            setOrderData(JSON.parse(savedData));
        }
    }, []);

    if (!isClient) {
        return null; // Or some loading spinner
    }

    const handleProceedPayment = () => {
        // Fetch existing orders from localStorage
        const existingOrders = JSON.parse(localStorage.getItem("myOrders")) || [];
        const chefList = JSON.parse(localStorage.getItem("credentials")) || [];

        // Create a new order structure with a single date
        const newOrder = {
            date: new Date().toISOString(),
            orderId: uniqueNumber,
            items: orderData,

        };

        // Combine new and existing orders
        const updatedOrders = [...existingOrders, newOrder];
        setOrderUpdateData(updatedOrders)
        // Save back to localStorage
        localStorage.setItem("myOrders", JSON.stringify(updatedOrders));
        localStorage.setItem("chefOrderDataList", JSON.stringify(updatedOrders));
        localStorage.removeItem("cartDatalength");
        successMsg("Thank you for your payment! Your transaction has been successfully processed.");
        window.location.replace("/orderhistory");
    };

    // Initialize an empty object to store the assignments
    const assignments = chefs.reduce((acc, chef) => {
        if (chef.email) {
            acc[chef.email] = []; // Ensure each chef has an array for orders
        }

        return acc;
    }, {});
    const myOrderUpdate = JSON.parse(localStorage.getItem("myOrders"));
    // // Distribute the orders
    myOrderUpdate?.forEach((order, index) => {

        const chefIndex = index % chefs.length; //v Determines which chef gets the order
        const chefEmail = chefs[chefIndex]?.email; // Safely access the chef's email

        if (chefEmail) {
            assignments[chefEmail].push(order); // Assign order to the chef
        }
        localStorage.setItem("particularChefOrder", JSON.stringify(assignments))
    });

    return (
        <>
            <LayoutHeader pageTitle="Payment Summary" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Payment Summary</h2>
                    <div className="space-y-4">
                        {orderData.length > 0 ? (
                            orderData?.map((item, index) => (
                                <div key={index} className="flex justify-between border-b pb-2">
                                    <div className="flex flex-col">
                                        <span className="text-gray-600 font-medium">{item.name}</span>
                                        <span className="text-gray-500 text-sm">{item.type}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-gray-600 font-medium">Qty: {item.quantity}</span>
                                        <span className="text-gray-800 font-bold ml-4">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">No order data available.</p>
                        )}
                        <div className="flex justify-between text-xl font-bold mt-4">
                            <span>Total</span>
                            <span>
                                $
                                {orderData
                                    .reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0)
                                    .toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleProceedPayment}
                        className="w-full mt-6 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </>
    );
}

export default Payment;
