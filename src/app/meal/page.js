"use client";
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardMedia, Typography, Grid, Button, Checkbox } from '@mui/material';
import { meals as initialMeals } from '@/service/mealData';
import styled from '@emotion/styled';

export default function Meal() {
    const searchParams = useSearchParams();
    const mealCategory = searchParams.get("category");
    const [meals, setMeals] = useState(initialMeals);
    const [orderData, setOrderData] = useState(() => {
        const savedData = localStorage.getItem("orderDataList");
        return savedData ? JSON.parse(savedData) : [];
    });

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

    const toggleOrderItem = (meal) => {
        const isAlreadyInOrder = orderData.some(orderItem => orderItem.id === meal.id);

        if (isAlreadyInOrder) {
            // Remove item if it's already in the order
            const updatedOrderData = orderData.filter(orderItem => orderItem.id !== meal.id);
            setOrderData(updatedOrderData);
            localStorage.setItem("orderDataList", JSON.stringify(updatedOrderData));
        } else {
            // Add item if it's not in the order
            const updatedOrderData = [...orderData, meal];
            setOrderData(updatedOrderData);
            localStorage.setItem("orderDataList", JSON.stringify(updatedOrderData));
        }
    };

    useEffect(() => {
        localStorage.setItem("orderDataList", JSON.stringify(orderData));
    }, [orderData]);

    const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
        color: "transparent",
        "&.Mui-checked": {
            color: "green",
        },
        "& .MuiSvgIcon-root": {
            fontSize: 48, // Adjust size as needed
        },
    }));

    return (
        <div>
            <h1>Meals</h1>
            <Grid container spacing={4}>
                {meals.map(meal => (
                    mealCategory === meal.type && (
                        <Grid item xs={12} sm={6} md={4} key={meal.id}>
                            <Card>
                                <CustomCheckbox
                                    checked={orderData.some(orderItem => orderItem.id === meal.id)}
                                    onClick={() => toggleOrderItem(meal)}
                                    inputProps={{ 'aria-label': 'controlled' }}
                                />
                                <CardMedia
                                    onClick={() => toggleOrderItem(meal)}
                                    component="img"
                                    alt={meal.name}
                                    height="140"
                                    image={meal.image}
                                />
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {meal.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {meal.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                                    </Typography>
                                    <Typography>
                                        Quantity:
                                        <Button onClick={() => handleQuantity(meal.id, "icr")}>+</Button>
                                        {meal.quantity}
                                        <Button onClick={() => handleQuantity(meal.id, "dec")}>-</Button>
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    )
                ))}
            </Grid>


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
