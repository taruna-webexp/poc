"use client";
import React, { useEffect, useState } from "react";
import {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Paper,
} from "@mui/material";

export default function Order() {
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        // Retrieve and parse the order data from localStorage
        const data = JSON.parse(localStorage.getItem("orderDataList")) || [];
        setOrderData(data);
    }, []);

    const handleRemoveItem = (id) => {
        // Remove the item from the orderData list
        const updatedOrderData = orderData.filter((item) => item.id !== id);
        setOrderData(updatedOrderData);
        localStorage.setItem("orderDataList", JSON.stringify(updatedOrderData));
    };

    const rows = orderData;

    return (
        <>
            {/* Table Section */}
            <TableContainer component={Paper} sx={{}}>
                <Table sx={{ minWidth: 850 }} aria-label="order table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Order Number</TableCell>
                            <TableCell>Order Item</TableCell>
                            <TableCell align="right">Order Name</TableCell>
                            <TableCell align="right">Category</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Cancel</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                                <TableCell align="left" component="th" scope="row">
                                    {row.id}
                                </TableCell>
                                <TableCell align="center">
                                    <img
                                        src={row.image}
                                        alt="food img"
                                        style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">{row.name}</TableCell>
                                <TableCell align="right">{row.type}</TableCell>
                                <TableCell align="right">{row.quantity}</TableCell>
                                <TableCell align="right">{row.price}</TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleRemoveItem(row.id)}
                                    >
                                        Cancel Order
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}