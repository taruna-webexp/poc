'use client';

import React, { useEffect, useState } from 'react';
import {
    DndContext,
    closestCenter,
    useSensor,
    useSensors,
    PointerSensor,
} from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';
import dayjs from 'dayjs';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
    Button,
} from '@mui/material';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Main KanbanBoard component to manage drag-and-drop functionality
const KanbanBoard = () => {
    // State variable to manage columns and their tasks
    const [columns, setColumns] = useState({
        allOrders: [],
        inProgress: [],
        completeOrder: [],
    });

    // useEffect hook to load data from local storage on initial render
    useEffect(() => {
        // Retrieve data from local storage and parse it to JSON format
        const data = JSON.parse(localStorage.getItem("chefOrderDataList")) || [];
        // Format the date property of each order
        const formattedOrders = data.map((order) => ({
            ...order,
            date: dayjs(order.date).format("YYYY-MM-DD"),
        }));

        // Set the state for columns with the formatted order data
        setColumns({
            allOrders: formattedOrders.map(order => ({
                id: order.orderId,
                items: order.items,
            })),
            inProgress: [],
            completeOrder: [],
        });
    }, []);

    // Initialize the drag-and-drop sensors
    const sensors = useSensors(useSensor(PointerSensor));

    // Handle the end of a drag-and-drop operation
    const handleDragEnd = (event) => {
        const { active, over } = event;
        // Exit if no drop target exists
        if (!over) return;

        // Find the source column where the item was initially located
        const sourceColumn = Object.keys(columns).find((key) =>
            columns[key].some((item) => item.id === active.id)
        );
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

                // Update the state with the new order of items in both columns
                return {
                    ...prev,
                    [sourceColumn]: sourceItems,
                    [destinationColumn]: destinationItems,
                };
            });
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

    // Main return rendering the Kanban board
    return (
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
                                                        <div key={index} className="flex items-center gap-2">
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
    );
};

export default KanbanBoard;
