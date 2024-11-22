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
    TablePagination,
} from "@mui/material";
import LayoutHeader from "@/app/layoutHearTitle";
import dayjs from "dayjs";

export default function Order() {
    const [orderData, setOrderData] = useState([]);
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

    useEffect(() => {
        // Retrieve and parse the order data from localStorage
        const data = JSON.parse(localStorage.getItem("chefOrderDataList")) || [];
        console.log("DTAA", data)




        // Format the date for each order
        const formattedOrders = [data].map((order) => ({
            ...order,
            date: dayjs(order.date).format("MMMM D, YYYY [at] h:mm A"),
        }));

        // Set the order data state with formatted data
        setOrderData(formattedOrders);
    }, []);

    const handleRemoveItem = (orderIndex, itemId) => {
        // Remove the item by itemId within the specific order
        const updatedOrderData = orderData.map((order, index) => {
            if (index === orderIndex) {
                return {
                    ...order,
                    items: order.items.filter(item => item.id !== itemId),
                };
            }
            return order;
        });

        setOrderData(updatedOrderData);
    };

    // Handle page change
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    // Handle rows per page change
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Calculate rows to display based on pagination
    const rowsToDisplay = orderData
        .flatMap(order => order.items)
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            <LayoutHeader pageTitle="All Orders" />

            {/* Display Date for each order */}
            {orderData.map((order, orderIndex) => (
                <div key={orderIndex}>
                    <h2>Order Date: {order.date}</h2>

                    {/* Table Section */}
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 850 }} aria-label="order table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order Item</TableCell>
                                    <TableCell align="right">Order Name</TableCell>
                                    <TableCell align="right">Category</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Price</TableCell>
                                    <TableCell align="center">Cancel</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order?.items?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
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
                                                onClick={() => handleRemoveItem(orderIndex, row.id)}
                                            >
                                                Cancel Item
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            ))}

            {/* Pagination */}
            <TablePagination
                component="div"
                count={orderData.flatMap(order => order.items).length} // Total number of rows
                page={page} // Current page
                onPageChange={handleChangePage} // Page change handler
                rowsPerPage={rowsPerPage} // Rows per page
                onRowsPerPageChange={handleChangeRowsPerPage} // Rows per page change handler
                rowsPerPageOptions={[5, 10, 15]} // Options for rows per page
            />
        </>
    );
}
