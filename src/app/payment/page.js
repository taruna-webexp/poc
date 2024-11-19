"use client";

import React, { useState, useEffect } from "react";

function Payment() {
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        const savedData = localStorage.getItem("orderDataList");
        if (savedData) {
            setOrderData(JSON.parse(savedData));
        }
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Payment Summary</h2>

                <div className="space-y-4">
                    {orderData.length > 0 ? (
                        orderData.map((item, index) => (
                            <div
                                key={index}
                                className="flex justify-between border-b pb-2"
                            >
                                <div className="flex flex-col">
                                    <span className="text-gray-600 font-medium">{item.name}</span>
                                    <span className="text-gray-500 text-sm">{item.type}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-600 font-medium">Qty: {item.quantity}</span>
                                    <span className="text-gray-800 font-bold ml-4">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">No order data available.</p>
                    )}
                    {/* Example Total Section */}
                    <div className="flex justify-between text-xl font-bold mt-4">
                        <span>Total</span>
                        <span>
                            $
                            {orderData.reduce(
                                (total, item) => total + parseFloat(item.price) * item.quantity,
                                0
                            ).toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Payment Button */}
                <button
                    type="button" onClick={() => alert("Thank you for your payment! Your transaction has been successfully processed.")}
                    className="w-full mt-6 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Proceed to Payment
                </button>
            </div>
        </div >
    );
}

export default Payment;
