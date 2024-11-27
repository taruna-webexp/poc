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
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import LayoutHeader from "@/app/layoutHearTitle";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import BasicDatePicker from "@/components/share/form/DatePicker";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSession } from "next-auth/react";

export default function Order() {
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

    const onSubmit = ({ startDateRange, endDateRange }) => {
        const filtered = orderData.filter((order) => {
            const orderDate = dayjs(order.date).format("YYYY-MM-DD");
            const start = dayjs(startDateRange).format("YYYY-MM-DD");
            const end = dayjs(endDateRange).format("YYYY-MM-DD");
            return orderDate >= start && orderDate <= end;
        });
        setFilteredData(filtered);
    };

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };



    useEffect(() => {
        const chefList = JSON.parse(localStorage.getItem("credentials")) || [];
        setChef(chefList);

    }, [filteredData]);

    // Devide data  per chef
    const ordersPerChef = Math.ceil(filteredData.length / chef.length);
    console.log("devideordersPerChef", ordersPerChef)
    const dividedOrders = chef.map((_, index) => {
        // devide orders to chefs
        const start = index * ordersPerChef;
        const end = Math.min(start + ordersPerChef, filteredData.length);
        return filteredData.slice(start, end);
    });


    const currentChef = session?.data?.user?.email; //current user
    const ifCurrentChefExist = chef.findIndex((item) => item.email === currentChef)

    // Filter orders for the current chef
    const currentChefOrders = dividedOrders[ifCurrentChefExist] || [];    //assign order
    const rowsToDisplay = [...currentChefOrders]
        .reverse()
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    return (
        <>
            <LayoutHeader pageTitle="All Orders" />

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
                <Grid container spacing={2} className="align-center my-6">
                    <Grid item xs={5} sm={5}>
                        <BasicDatePicker
                            name="startDateRange"
                            control={control}
                            maxDate={endDate}
                        />
                    </Grid>
                    <Grid item xs={5} sm={5}>
                        <BasicDatePicker
                            name="endDateRange"
                            control={control}
                            minDate={startDate}
                        />
                    </Grid>
                    <Grid item xs={2} sm={2}>
                        <Button
                            className="!mt-2 !bg-red-500 hover:!bg-red-600 text-center"
                            type="submit"
                            variant="contained"
                            size="large"
                        >
                            Apply
                        </Button>
                    </Grid>
                </Grid>
            </form>

            <TableContainer sx={{ maxHeight: 580 }} component={Paper}>
                <Table stickyHeader sx={{ minWidth: 850 }} aria-label="sticky table">
                    <TableHead>
                        <TableRow className="table-head-row">
                            <TableCell>Order Item</TableCell>
                            <TableCell align="right">Order Name</TableCell>
                            <TableCell align="right">Category</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="bg-red-100">
                        {rowsToDisplay.map((order, orderIndex) => (
                            <React.Fragment key={orderIndex}>
                                <TableRow sx={{ backgroundColor: "#cfc2c2", color: "white" }}>
                                    <TableCell colSpan={6} sx={{ fontWeight: "bold", color: "black" }}>
                                        <span className="text-red-600">
                                            {dayjs(order.date).format(
                                                "MMMM D, YYYY [at] h:mm A"
                                            )}
                                        </span>
                                    </TableCell>
                                </TableRow>

                                {/* Display the first item */}
                                <TableRow>
                                    <TableCell align="center">
                                        <img
                                            src={order.items[0].image}
                                            alt="food img"
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                objectFit: "cover",
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">{order.items[0].name}</TableCell>
                                    <TableCell align="right">{order.items[0].type}</TableCell>
                                    <TableCell align="right">{order.items[0].quantity}</TableCell>
                                    <TableCell align="right">${order.items[0].price}</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>

                                {/* Display the remaining items in an accordion */}
                                {order.items.length > 1 && (
                                    <TableRow>
                                        <TableCell colSpan={6} style={{ padding: 0 }}>
                                            <Accordion style={{ width: "100%", }}>
                                                <AccordionSummary className="accordionSummaryContent" expandIcon={<ExpandMoreIcon />} style={{ width: "100%", position: "absolute", top: "-65px", right: 0 }}>
                                                    <span>More</span>
                                                </AccordionSummary>
                                                <AccordionDetails style={{ padding: 0 }}>
                                                    <Table style={{ width: "100%" }}>
                                                        <TableBody className="bg-red-100">
                                                            {order.items.slice(1).map((item, itemIndex) => (
                                                                <TableRow key={itemIndex}>
                                                                    <TableCell align="center">
                                                                        <img
                                                                            src={item.image}
                                                                            alt="food img"
                                                                            style={{
                                                                                width: "50px",
                                                                                height: "50px",
                                                                                objectFit: "cover",
                                                                                borderRadius: "8px",
                                                                            }}
                                                                        />
                                                                    </TableCell>
                                                                    <TableCell align="right">{item.name}</TableCell>
                                                                    <TableCell align="right">{item.type}</TableCell>
                                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                                    <TableCell align="right">${item.price}</TableCell>
                                                                    <TableCell align="right"></TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </AccordionDetails>
                                            </Accordion>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={currentChefOrders.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 15]}
            />
        </>
    );
}
