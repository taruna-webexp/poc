"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, Typography, Grid, Button, Grid2 } from '@mui/material';
import { meals as initialMeals } from '@/service/mealData';
import CheckboxGroup from '@/components/share/form/CheckboxGroup';
import { useForm, Controller } from 'react-hook-form';
import CheckboxGroup2 from '@/components/share/form/CheckboxGroup2';

export default function Meal() {
    const { control, setValue } = useForm();
    const searchParams = useSearchParams();
    const mealCategory = searchParams.get("category");
    const [meals, setMeals] = useState(initialMeals);
    const [orderData, setOrderData] = useState(() => {
        const savedData = localStorage.getItem("orderDataList");
        return savedData ? JSON.parse(savedData) : [];
    });

    const toggleOrderItem = (meal) => {
        const isAlreadyInOrder = orderData.some(orderItem => orderItem.id === meal.id);

        const updatedOrderData = isAlreadyInOrder
            ? orderData.filter(orderItem => orderItem.id !== meal.id) // Remove
            : [...orderData, meal]; // Add

        setOrderData(updatedOrderData);
        localStorage.setItem("orderDataList", JSON.stringify(updatedOrderData));
    };

    // Sync localStorage with orderData when orderData updates
    useEffect(() => {
        localStorage.setItem("orderDataList", JSON.stringify(orderData));
    }, [orderData]);

    const handleQuantity = (mealId, type) => {
        setMeals(prevMeals =>
            prevMeals.map(meal => {
                if (meal.id === mealId) {
                    const newQuantity = type === "icr" ? meal.quantity + 1 : Math.max(meal.quantity - 1, 1);
                    return { ...meal, quantity: newQuantity };
                }
                return meal;
            })
        );
    };

    return (
        <div>
            <Grid2 container spacing={4} className="!ms-8 mt-8">
                {meals.map((meal) => {
                    console.log("meal", meal)

                    return (
                        mealCategory === meal.type && (
                            <Grid item xs={12} sm={6} md={4} key={meal.id}>
                                <CheckboxGroup2
                                    name={meal.name}
                                    options={[meal]}
                                    control={control}
                                    setValue={(name, value) => {
                                        setValue(name, value);
                                        toggleOrderItem(meal);
                                    }}

                                />
                                <Card>
                                    <CardContent>
                                        <Typography variant="h4" component="div">
                                            {meal.name}
                                        </Typography>
                                        <Typography variant="h6" component="div">
                                            <b>${meal.price}</b>
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {meal.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                                        </Typography>
                                        <Typography>
                                            Quantity:&nbsp;
                                            <Button
                                                onClick={() => handleQuantity(meal.id, "icr")}
                                                sx={{
                                                    minWidth: '36px',
                                                    height: '36px',
                                                    padding: 0,
                                                    backgroundColor: '#4caf50',
                                                    color: '#fff',
                                                    borderRadius: '50%',
                                                    '&:hover': {
                                                        backgroundColor: '#388e3c',
                                                    }
                                                }}
                                            >
                                                +
                                            </Button>
                                            <input
                                                type="number"
                                                value={meal.quantity}
                                                onChange={(e) => setMeals(prevMeals => prevMeals.map(m => m.id === meal.id ? { ...m, quantity: Math.max(Number(e.target.value), 1) } : m))}
                                                style={{
                                                    width: '50px',
                                                    textAlign: 'center',
                                                    margin: '0 8px',
                                                    fontSize: '16px',
                                                    padding: '5px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '4px',
                                                }}
                                            />
                                            <Button
                                                onClick={() => handleQuantity(meal.id, "dec")}
                                                sx={{
                                                    minWidth: '36px',
                                                    height: '36px',
                                                    padding: 0,
                                                    backgroundColor: '#f44336',
                                                    color: '#fff',
                                                    borderRadius: '50%',
                                                    '&:hover': {
                                                        backgroundColor: '#d32f2f',
                                                    }
                                                }}
                                            >
                                                -
                                            </Button>
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    )
                })}
            </Grid2>

            <div className="order-button-container">
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    disabled={orderData.length === 0}
                    sx={{
                        marginTop: 4,
                        padding: '15px',
                        fontSize: '16px',
                        backgroundColor: '#D32F2F', // Red color
                        color: '#fff',
                        "&:hover": {
                            backgroundColor: "#c62828", // Darker red
                        },
                    }}
                    onClick={() => alert("Order placed successfully!")}
                >
                    {orderData.length === 0 ? "No items in your order" : "Place Order"}
                </Button>
            </div>
        </div>
    );
}
