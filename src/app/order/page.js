"use client";
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Button, Container, CardMedia } from '@mui/material';

export default function Order() {
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        // Retrieve and parse the order data from localStorage
        const data = JSON.parse(localStorage.getItem("orderDataList")) || [];
        setOrderData(data);
    }, []);

    const handleRemoveItem = (id) => {
        // Remove the item from the orderData list
        const updatedOrderData = orderData.filter(item => item.id !== id);
        setOrderData(updatedOrderData);
        localStorage.setItem("orderDataList", JSON.stringify(updatedOrderData));
    };

    return (
        <Container maxWidth="lg" sx={{ marginTop: 4 }}>
            <Typography variant="h4" gutterBottom>
                Your Order
            </Typography>

            <Grid container spacing={4}>
                {orderData.length === 0 ? (
                    <Typography variant="h6" color="textSecondary">
                        No items in your order.
                    </Typography>
                ) : (
                    orderData.map((meal) => (
                        <Grid item xs={12} sm={6} md={4} key={meal.id}>
                            <Card>
                                <CardContent>
                                    <CardMedia
                                        onClick={() => toggleOrderItem(meal)}
                                        component="img"
                                        alt={meal.name}
                                        height="40"
                                        image={meal.image}
                                    />
                                    <Typography variant="h6">{meal.name}</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {meal.type === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                                    </Typography>
                                    <Typography variant="body1" color="textPrimary" gutterBottom>
                                        Quantity: {meal.quantity}
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleRemoveItem(meal.id)}
                                    >
                                        Remove from Order
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Container>
    );
}
