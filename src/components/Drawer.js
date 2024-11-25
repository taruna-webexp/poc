"use client";
import React, { useState } from "react";
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
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@mui/material";
import FastfoodIcon from '@mui/icons-material/Fastfood';
import DashboardIcon from '@mui/icons-material/Dashboard';

export default function TemporaryDrawer({ open, setOpen }) {
    const [selectedItem, setSelectedItem] = useState();
    const router = useRouter();
    const currentPath = usePathname()


    const adminPageUrl = [
        { text: "Dashboard", href: "/admin/dashboard", icon: <DashboardIcon /> },
        { text: "Orders", href: "/admin/order", icon: <FastfoodIcon /> },
    ];

    const DrawerList = (
        <Box className="" sx={{
            width: 230,

            background: "transparent",
        }} role="presentation">
            <List>
                {adminPageUrl.map(({ text, href, icon }, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton
                            selected={selectedItem === index}
                            onClick={() => {
                                setSelectedItem(index);
                                router.push(href);
                            }}
                            className={`${selectedItem === index || currentPath === href ? "!bg-red-600 !text-white" : ""}`}

                        >
                            <ListItemIcon className={`${selectedItem === index || currentPath === href ? "!text-white" : ""}`} >
                                {icon}
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
            <Drawer open={open} onClose={() => { }} variant="persistent" className="adminpanel-component">
                {DrawerList}
            </Drawer>
        </>
    );
}
