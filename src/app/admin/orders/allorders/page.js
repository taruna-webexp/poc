"use client";

import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Grid,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Paper,
    Box,
    CardActions,
} from "@mui/material";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import BasicDatePicker from "@/components/share/form/DatePicker";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSession } from "next-auth/react";
import FormInput from "@/components/share/form/FormInput";
import { successMsg } from "@/components/msg/toaster";
import LayoutHeader from "@/app/layoutHearTitle";

export default function AllOrder() {
    const [orderData, setOrderData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const session = useSession();
    const [chef, setChef] = useState([]);
    const today = dayjs();

    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            startDateRange: today.subtract(1, "month"),
            endDateRange: today,
        },
    });

    const startDate = watch("startDateRange");
    const endDate = watch("endDateRange");

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem("chefOrderDataList")) || [];
        const formattedOrders = data.map((order) => ({
            ...order,
            date: dayjs(order.date).format("YYYY-MM-DD"),
        }));

        setOrderData(formattedOrders);
        setFilteredData(formattedOrders);
    }, []);

    const onSubmit = ({ startDateRange, endDateRange, orderNumber }) => {
        const filtered = orderData.filter((order) => {
            const orderDate = dayjs(order.date).format("YYYY-MM-DD");
            const start = dayjs(startDateRange).format("YYYY-MM-DD");
            const end = dayjs(endDateRange).format("YYYY-MM-DD");

            const dateInRange = orderDate >= start && orderDate <= end;
            const orderNumberMatch = orderNumber ? order.orderId.toString() === orderNumber.toString() : true;

            return dateInRange && orderNumberMatch;
        });

        setFilteredData(filtered);
    };

    useEffect(() => {
        const chefList = JSON.parse(localStorage.getItem("credentials")) || [];
        setChef(chefList);
    }, []);

    const ordersPerChef = Math.ceil(filteredData.length / chef.length);
    const dividedOrders = chef.map((_, index) => {
        const start = index * ordersPerChef;
        const end = Math.min(start + ordersPerChef, filteredData.length);
        return filteredData.slice(start, end);
    });

    const currentChef = session?.data?.user?.email;
    const ifCurrentChefExist = chef.findIndex((item) => item.email === currentChef);

    const currentChefOrders = dividedOrders[ifCurrentChefExist] || [];
    const rowsToDisplay = currentChefOrders.reverse().slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const handleCompleteOrder = (id) => {
        successMsg("Order successfully completed");

        const updatedOrders = filteredData.filter((order) => order.orderId !== id);

        const completeOrder = filteredData.find((order) => order.orderId === id);
        if (completeOrder) {
            let chefCompletedOrderArray = JSON.parse(localStorage.getItem("chefCompletedOrder")) || [];
            chefCompletedOrderArray.push(completeOrder);

            localStorage.setItem("chefCompletedOrder", JSON.stringify(chefCompletedOrderArray));
            localStorage.setItem("chefOrderDataList", JSON.stringify(updatedOrders));
            setFilteredData(updatedOrders);
        }
    };

    return (
        <>
            <LayoutHeader pageTitle="All Orders" />
            <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 3 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={3} sm={4}>
                            <BasicDatePicker name="startDateRange" control={control} maxDate={endDate} />
                        </Grid>
                        <Grid item xs={3} sm={4}>
                            <BasicDatePicker name="endDateRange" control={control} minDate={startDate} />
                        </Grid>
                        <Grid item xs={3} sm={3}>
                            <FormInput name="orderNumber" control={control} inputType="number" placeholder="Order ID" />
                        </Grid>
                        <Grid item xs={2} sm={1}>
                            <Button type="submit" variant="contained" color="error">
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            <Grid container spacing={4}>
                {rowsToDisplay.length > 0 ? rowsToDisplay.map((order, orderIndex) => (
                    <Grid item xs={12} sm={6} md={4} key={orderIndex}>
                        <Card sx={{ borderRadius: 2, boxShadow: 3, '&:hover': { boxShadow: 6 }, transition: 'box-shadow 0.3s ease' }}>
                            <CardHeader
                                title={<Typography sx={{ fontWeight: 'bold', color: 'text.primary' }}>Order ID: {order.orderId}</Typography>}
                                sx={{ backgroundColor: '#efd6d6', borderTopLeftRadius: 2, borderTopRightRadius: 2 }}
                            />
                            <CardMedia
                                component="img"
                                height="140"
                                image={order.items[0].image}
                                alt={order.items[0].name}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent sx={{ backgroundColor: '#efd6d6' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>{order.items[0].name}</Typography>
                                <Typography variant="body2" color="text.secondary">Category: {order.items[0].type}</Typography>
                                <Typography variant="body2" color="text.secondary">Quantity: {order.items[0].quantity}</Typography>
                            </CardContent>

                            {order.items.length > 1 && (
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>More items</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        {order.items.slice(1).map((item, itemIndex) => (
                                            <Box key={itemIndex} mb={2}>
                                                <CardMedia
                                                    component="img"
                                                    height="50"
                                                    image={item.image}
                                                    alt={item.name}
                                                    sx={{ objectFit: "cover" }}
                                                />
                                                <Typography>{item.name}</Typography>
                                                <Typography>Category: {item.type}</Typography>
                                                <Typography>Quantity: {item.quantity}</Typography>
                                            </Box>
                                        ))}
                                    </AccordionDetails>
                                </Accordion>
                            )}
                            <CardActions>
                                <Button className="!w-full !capitalize !font-semibold" variant="contained" color="error" onClick={() => handleCompleteOrder(order.orderId)}>
                                    Complete the order
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                )) : (<>
                    <Grid item xs={12} sm={12} md={12}>
                        <Typography className="text-center text-red-600">{"You don't have any orders."}</Typography></Grid>
                </>)}
            </Grid >
        </>
    );
}
