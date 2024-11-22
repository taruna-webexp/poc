"use client";
import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import DashboardIcon from '@mui/icons-material/Dashboard';
export default function TemporaryDrawer({ open, setOpen }) {
    const router = useRouter();

    const toggleDrawer = () => {
        setOpen(!open); // Toggle drawer state
    };

    const adminPageUrl = [
        { text: "Dashboard", href: "/admin/dashboard" },
        { text: "Orders", href: "/admin/order" },
    ];

    const DrawerList = (
        <Box className="" sx={{
            width: 230,
            // height: 'auto',

            background: "transparent",
        }} role="presentation">
            <List>
                {adminPageUrl.map(({ text, href }, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton
                            onClick={() => {
                                router.push(href); // Navigate programmatically
                            }}
                        >
                            <ListItemIcon>
                                {index % 2 === 0 ? <DashboardIcon /> : <FastfoodIcon />}
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>


        </Box>
    );

    return (
        <>
            {/* The Drawer */}
            <Drawer open={open} onClose={() => { }} variant="persistent" className="adminpanel-component  ">
                {DrawerList}
            </Drawer>



        </>
    );
}
