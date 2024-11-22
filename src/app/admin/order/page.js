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
    Grid,
} from "@mui/material";
import LayoutHeader from "@/app/layoutHearTitle";
import dayjs from "dayjs";
import DatePicker from "@/components/share/form/DatePicker";
import { useForm } from "react-hook-form";

export default function Order() {
    const [orderData, setOrderData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [page, setPage] = useState(0); // Current page
    const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page

    // DATEFILTER
    const { control, handleSubmit } = useForm({
        defaultValues: {
            dateRange: [dayjs(), dayjs()], // Default value for both start and end date
        },
    });


    // Form submit handler
    const onSubmit = (data) => {
        const [startDate, endDate] = data.dateRange;

        if (startDate || endDate) {
            // Format dates to exclude the time part for comparison
            const formattedStartDate = startDate ? dayjs(startDate).format("YYYY-MM-DD") : null;
            const formattedEndDate = endDate ? dayjs(endDate).format("YYYY-MM-DD") : null;

            const filteredByDate = orderData.filter((item) => {
                const itemDate = dayjs(item.date).format("YYYY-MM-DD");
                return (
                    itemDate === formattedStartDate ||
                    itemDate === formattedEndDate
                );
            });

            console.log("Filtered Data:", filteredByDate);
            setFilteredData(filteredByDate);
        } else {
            setFilteredData(orderData); // Show all data if no date is selected
        }
    };

    useEffect(() => {
        // Retrieve and parse the order data from localStorage
        const data = JSON.parse(localStorage.getItem("chefOrderDataList")) || [];
        console.log("DATA", data);

        // Format the date for each order to include only the date part
        const formattedOrders = data.map((order) => ({
            ...order,
            date: dayjs(order.date).format("YYYY-MM-DD"), // Format to YYYY-MM-DD
        }));

        setOrderData(formattedOrders);
        setFilteredData(formattedOrders); // Initialize filteredData
    }, []);

    const handleRemoveItem = (orderIndex, itemId) => {
        // Remove the item by itemId within the specific order
        const updatedOrderData = filteredData.map((order, index) => {
            if (index === orderIndex) {
                return {
                    ...order,
                    items: order.items.filter((item) => item.id !== itemId),
                };
            }
            return order;
        });

        setOrderData(updatedOrderData);
        setFilteredData(updatedOrderData);
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
    const rowsToDisplay = [...filteredData]
        .reverse()
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <>
            <LayoutHeader pageTitle="All Orders" />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} className="align-center my-6">
                    <Grid item xs={12} sm={6}>
                        <DatePicker name="dateRange" control={control} /></Grid>
                    <Grid item xs={12} sm={6}>
                        <Button className="!mt-4 !bg-red-500 hover:!bg-red-600  " type="submit" variant="contained" size="large">
                            Submit
                        </Button>
                    </Grid> </Grid>

            </form>

            {/* Table Section */}
            <TableContainer sx={{ maxHeight: 580 }} component={Paper}>
                <Table stickyHeader sx={{ minWidth: 850 }} aria-label="sticky table">
                    <TableHead>
                        <TableRow className="table-head-row">
                            <TableCell>Order Item</TableCell>
                            <TableCell align="right">Order Name</TableCell>
                            <TableCell align="right">Category</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Cancel</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {rowsToDisplay.map((order, orderIndex) => (
                            <React.Fragment key={orderIndex}>
                                <TableRow sx={{ backgroundColor: "#cfc2c2", color: "white" }}>
                                    <TableCell colSpan={6} sx={{ fontWeight: "bold", color: "black" }}>
                                        <span className="text-red-600">{dayjs(order.date).format("MMMM D, YYYY [at] h:mm A")}</span>
                                    </TableCell>
                                </TableRow>

                                {order.items.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            "&:last-child td, &:last-child th": { border: 0 },
                                            backgroundColor: "#e5dede",
                                            color: "white",
                                        }}
                                    >
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
                                        <TableCell align="right">${row.price}</TableCell>
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
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
                component="div"
                count={filteredData.length} // Total number of rows
                page={page} // Current page
                onPageChange={handleChangePage} // Page change handler
                rowsPerPage={rowsPerPage} // Rows per page
                onRowsPerPageChange={handleChangeRowsPerPage} // Rows per page change handler
                rowsPerPageOptions={[5, 10, 15]} // Options for rows per page
            />
        </>
    );
}
