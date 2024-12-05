import { Accordion, AccordionDetails, AccordionSummary, Button, CardContent, CardMedia, Typography } from '@mui/material'
import React from 'react'
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function AccordionComponent({ task }) {
    return (
        <div onClick={() => console.log("click")}>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} className='abcd'>
                    <Button >
                        More items
                    </Button>
                </AccordionSummary>
                <AccordionDetails>
                    {task.items.slice(1).map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
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
        </div>
    )
}
