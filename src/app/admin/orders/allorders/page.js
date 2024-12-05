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

} from "@mui/material";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import BasicDatePicker from "@/components/share/form/DatePicker";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormInput from "@/components/share/form/FormInput";
import LayoutHeader from "@/app/layoutHearTitle";

import {
    useDraggable,
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
    useDroppable,
} from "@dnd-kit/core";

export default function AllOrder() {
    const [orderData, setOrderData] = useState([]);
    const [columns, setColumns] = useState(() => {
        const savedData = localStorage.getItem("dragDropData");
        return savedData ? JSON.parse(savedData) :
            {
                allOrders: [],
                inProgress: [],
                completeOrder: []
            }
    });


    const today = dayjs();

    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            startDateRange: today.subtract(1, "month"),
            endDateRange: today,
        },
    });
    const startDate = watch("startDateRange");
    const endDate = watch("endDateRange");
    console.log("test", columns)


    // useEffect hook to load data from local storage on initial render

    useEffect(() => {
        // Check if `newChefOrderDataList` already exists in localStorage
        const storedData = localStorage.getItem('chefOrderDataList');
        const newChefOrderDataList = localStorage.getItem('newChefOrderDataList');

        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);

                // Only set `newChefOrderDataList` if it does not already exist
                if (!newChefOrderDataList) {
                    localStorage.setItem('newChefOrderDataList', JSON.stringify(parsedData));
                    console.log('Data set in new localStorage key: newChefOrderDataList');
                }

                // Format and update state as necessary
                const formattedOrders = parsedData.map((order) => ({
                    ...order,
                    date: dayjs(order.date).format('YYYY-MM-DD'),
                }));
                setOrderData(formattedOrders)
                setColumns((prev) => {
                    const inProgressIds = prev.inProgress.map(order => order.id);
                    const completeOrderIds = prev.completeOrder.map(order => order.id);

                    return {
                        ...prev,
                        allOrders: formattedOrders
                            .filter(order => !inProgressIds.includes(order.orderId) && !completeOrderIds.includes(order.orderId))
                            .map(order => ({
                                id: order.orderId,
                                date: order.date,
                                items: order.items,
                            })),
                        inProgress: prev.inProgress,
                        completeOrder: prev.completeOrder
                    };
                });
            }
            catch (error) {
                console.error('Error parsing stored data:', error);
            }
        } else {
            // Handle case when there is no `chefOrderDataList` in localStorage
            console.log('No order data found in localStorage');
        }
    }, []); // Empty dependency array to run only once on component mount

    // Update localStorage whenever data changes
    useEffect(() => {
        localStorage.setItem("dragDropData", JSON.stringify(columns));
    }, [columns]);

    // Initialize the drag-and-drop sensors
    const sensors = useSensors(useSensor(PointerSensor));


    // Filter data based on the form submission
    const onSubmit = ({ startDateRange, endDateRange, orderNumber }) => {
        // Format date range
        const start = startDateRange ? dayjs(startDateRange).format("YYYY-MM-DD") : null;
        const end = endDateRange ? dayjs(endDateRange).format("YYYY-MM-DD") : null;

        // Parse data from localStorage
        const dataDrag = JSON.parse(localStorage.getItem("dragDropData")) || {
            allOrders: [],
            inProgress: [],
            completeOrder: [],
        };

        // Filter function
        const filterOrders = (orders) => {
            return orders.filter((order) => {
                const orderDate = order.date;

                const isOrderMatch = orderNumber
                    ? order.id.toString() === orderNumber.toString()
                    : true;

                const isDateInRange = start && end
                    ? orderDate >= start && orderDate <= end
                    : true;

                return isOrderMatch && isDateInRange;
            });
        };

        // Apply filter to all categories
        const filteredData = {
            allOrders: filterOrders(dataDrag.allOrders),
            inProgress: filterOrders(dataDrag.inProgress),
            completeOrder: filterOrders(dataDrag.completeOrder),
        };

        // Update state
        setColumns({
            allOrders: filteredData.allOrders,
            inProgress: filteredData.inProgress,
            completeOrder: filteredData.completeOrder,
        });

        console.log("Filtered Data", filteredData);
    };





    // Handle the end of a drag-and-drop operation
    const handleDragEnd = (event) => {
        console.log("event1111111111", event)
        const { active, over } = event;
        // Exit if no drop target exists
        if (!over) return;

        // Find the source column where the item was initially located
        const sourceColumn = Object.keys(columns).find((key) =>
            columns[key].some((item) => item.id === active.id)
        );

        console.log("sourceColumn", sourceColumn)

        // Identify the destination column where the item is dropped
        const destinationColumn = over.id;

        // Check if the source and destination columns are valid and different
        if (sourceColumn && destinationColumn && sourceColumn !== destinationColumn) {
            setColumns((prev) => {
                // Clone the current source and destination columns
                const sourceItems = [...prev[sourceColumn]];
                const destinationItems = [...prev[destinationColumn]];

                // Find and remove the item from the source column
                const [movedItem] = sourceItems.splice(
                    sourceItems.findIndex((item) => item.id === active.id),
                    1
                );
                // Add the item to the destination column
                destinationItems.push(movedItem);
                console.log("destinationItems", destinationItems)
                console.log("sourceColumn", sourceItems)
                // Update the state with the new order of items in both columns
                return {
                    ...prev,
                    [sourceColumn]: sourceItems,
                    [destinationColumn]: destinationItems,
                };

            });
            const upDatedDats = JSON.parse(localStorage.getItem("newdata"))
            console.log("upDatedDats", upDatedDats)

        }
    };

    // Droppable component for columns
    const Droppable = ({ id, children }) => {
        const { setNodeRef } = useDroppable({ id });
        return (
            <div
                ref={setNodeRef}
                className="bg-gray-100 p-4 border rounded min-h-[200px]"
                style={{ minHeight: "200px", padding: "16px", border: "1px solid gray" }}
            >
                {children}
            </div>
        );
    };


    // Draggable component for task cards
    const Draggable = ({ id, children }) => {
        const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

        // Define the style for the draggable element
        const style = {
            transform: transform
                ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
                : undefined,
        };

        return (
            <div
                ref={setNodeRef}
                style={{ ...style, cursor: "grab" }}
                {...listeners}
                {...attributes}
                className="p-2 border rounded mb-2 bg-white shadow"
            >
                {children}
            </div>
        );
    };

    return (
        <>
            <LayoutHeader pageTitle="All Orders" />
            <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 3 }}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={3} sm={4}>
                            <BasicDatePicker
                                name="startDateRange"
                                control={control}
                                maxDate={endDate}
                            />
                        </Grid>
                        <Grid item xs={3} sm={4}>
                            <BasicDatePicker
                                name="endDateRange"
                                control={control}
                                minDate={startDate}
                            />
                        </Grid>
                        <Grid item xs={3} sm={3}>
                            <FormInput
                                name="orderNumber"
                                control={control}
                                inputType="number"
                                placeholder="Order ID"
                            />
                        </Grid>
                        <Grid item xs={2} sm={1}>
                            <Button type="submit" variant="contained" color="error">
                                Apply
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                {/* Render columns dynamically based on state */}
                <div className="grid grid-cols-3 gap-4 p-4">
                    {Object.keys(columns).map((columnId) => (
                        <div key={columnId} className="flex flex-col">
                            <h3 className="text-lg font-bold capitalize">{columnId}</h3>
                            <Droppable id={columnId}>
                                {columns[columnId].map((task) => (
                                    <Draggable key={task.id} id={task.id}>
                                        {/* Display each task as a Material-UI Card */}
                                        <Card sx={{ width: 200, marginBottom: 2 }}>
                                            <CardHeader
                                                title={`Order ID: ${task.id}`}
                                                sx={{ backgroundColor: "#efd6d6" }}
                                            />
                                            <CardMedia
                                                component="img"
                                                height="40"
                                                image={task.items[0].image || "/default-image.jpg"}
                                            />
                                            <CardContent>
                                                <Typography variant="body2">
                                                    Name: {task.items[0].name}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Quantity: {task.items[0].quantity}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Price: ${task.items[0].price.toFixed(2)}
                                                </Typography>
                                            </CardContent>
                                            {/* Accordion for additional item details */}
                                            {task.items.length > 1 && (
                                                <Accordion>
                                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} onPointerDown={(e) => e.stopPropagation()}>
                                                        <Typography>More items</Typography>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        {task.items.slice(1).map((item, index) => (
                                                            <div key={index} className=" items-center gap-2">
                                                                <CardMedia
                                                                    component="img"
                                                                    height="40"
                                                                    image={item.image || "/default-image.jpg"}
                                                                />
                                                                <CardContent>
                                                                    <Typography variant="body2">
                                                                        Name: {item.name}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        Quantity: {item.quantity}
                                                                    </Typography>
                                                                    <Typography variant="body2">
                                                                        Price: ${item.price.toFixed(2)}
                                                                    </Typography>
                                                                </CardContent>
                                                            </div>
                                                        ))}
                                                    </AccordionDetails>
                                                </Accordion>
                                            )}
                                        </Card>
                                    </Draggable>
                                ))}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DndContext>
        </>
    );
}
