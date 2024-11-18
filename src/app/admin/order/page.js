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

export default function Order() {
    const [orderData, setOrderData] = useState([]);
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

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
    const rowsToDisplay = orderData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            {/* Table Section */}
            <TableContainer component={Paper}>
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
                        {rowsToDisplay.map((row) => (
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

            {/* Pagination */}
            <TablePagination
                component="div"
                count={orderData.length} // Total number of rows
                page={page} // Current page
                onPageChange={handleChangePage} // Page change handler
                rowsPerPage={rowsPerPage} // Rows per page
                onRowsPerPageChange={handleChangeRowsPerPage} // Rows per page change handler
                rowsPerPageOptions={[5, 10, 15]} // Options for rows per page
            />
        </>
    );
}
