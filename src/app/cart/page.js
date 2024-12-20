"use client";

import React, { useState, useEffect } from 'react';
import LayoutHeader from '../layoutHearTitle';
import { errorMsg, successMsg } from '@/components/msg/toaster';
import { useRouter } from 'next/navigation';

function Cart() {
    const [cartData, setCartData] = useState([]);

    useEffect(() => {
        // Fetch data from localStorage on the client side
        const storedCartData = localStorage.getItem('cartDatalength');
        if (storedCartData) {
            setCartData(JSON.parse(storedCartData));
        }
    }, []);

    const updateLocalStorage = (updatedData) => {
        setCartData(updatedData);
        localStorage.setItem('cartDatalength', JSON.stringify(updatedData));
        localStorage.setItem('orderplaceList', JSON.stringify(updatedData));
    };

    // Quantity increment handler
    const handleIncrement = (id) => {
        const updatedCart = cartData.map((item) => id === item.id ? { ...item, quantity: item.quantity + 1 } : item);
        updateLocalStorage(updatedCart);
    };

    // Quantity decrement handler
    const handleDecrement = (id) => {
        const updatedCart = cartData.map((item) => id === item.id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item);
        updateLocalStorage(updatedCart);
    };

    // Remove item from cart handler
    const handleCartItemRemove = (id) => {
        const updatedCart = cartData.filter(item => item.id !== id);
        updateLocalStorage(updatedCart);
    };

    // Proceed to checkout handler
    const handleProceedItem = () => {
        if (cartData.length > 0) {
            successMsg(`Your order has been placed! Total`);
            setTimeout(() => {
                window.location.replace("/payment");
            }, 2000);
        } else {
            errorMsg("Cart is empty");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4">
            <LayoutHeader pageTitle="Your Cart Item" />
            <div className="space-y-4">
                {cartData.length > 0 ? (
                    cartData.map(item => (
                        <div key={item.id} className="flex items-center justify-between border p-4 rounded-lg">
                            <div className="flex items-center">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover mr-4"
                                />
                                <div>
                                    <h2 className="text-lg font-medium">{item.name}</h2>
                                    <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleDecrement(item.id)}
                                    className="px-2 py-1 bg-gray-200 rounded"
                                >
                                    -
                                </button>
                                <span className="font-medium">{item.quantity}</span>
                                <button
                                    onClick={() => handleIncrement(item.id)}
                                    className="px-2 py-1 bg-gray-200 rounded"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => handleCartItemRemove(item.id)}
                                className="text-red-500 font-medium ml-4"
                            >
                                Remove
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">Your cart is empty.</p>
                )}
            </div>
            <div className="mt-6 border-t pt-4 bg-red-100">
                <div className="flex justify-between items-center mb-4 p-2">
                    <span className="text-lg font-medium">Total:</span>
                    <span className="text-lg font-bold">
                        $
                        {cartData?.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
                    </span>
                </div>
                <button onClick={handleProceedItem} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}

export default Cart;
