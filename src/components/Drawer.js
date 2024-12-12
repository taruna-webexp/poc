"use client";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { usePathname, useRouter } from "next/navigation";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import { useSession } from "next-auth/react";

export default function TemporaryDrawer({ open, setOpen }) {
    const [selectedItem, setSelectedItem] = useState(null); // Track selected item
    const [expandedItem, setExpandedItem] = useState(null); // Track expanded items
    const router = useRouter();
    const currentPath = usePathname();
    const session = useSession();

    const adminPageUrl = [
        { text: "Dashboard", href: "/admin/dashboard", icon: <DashboardIcon /> },
        {
            text: "Orders",
            icon: <FastfoodIcon />,
            children: [

                { Title: "All Orders", path: `/admin/orders/allorders` },
            ],
        },
        session.data !== null && session.data !== undefined
            ? { text: "Log out", href: "/auth/signin", icon: <PowerSettingsNewIcon /> }
            : { text: "Log in", href: "/auth/signin", icon: <PowerSettingsNewIcon /> },
    ];
    useEffect(() => {
        // Expand "Orders" by default if the current path is under its children
        if (currentPath === "/admin/orders/allorders") {
            setExpandedItem(1); // Expand the "Orders" section (index 1 in adminPageUrl)
        }
    }, [currentPath]);

    const handleClick = (item) => {
        setExpandedItem((prev) => (prev === item ? null : item));
    };

    const handleOrdersClick = (index) => {
        // alert("Orders clicked!"); // Example action: show an alert
        setSelectedItem("Orders"); // Set "Orders" as the selected item
        setExpandedItem((prev) => (prev === index ? null : index));
    };
    ;

    const DrawerList = (
        <Box className="" sx={{ width: 230, background: "transparent" }} role="presentation">
            <List>
                {adminPageUrl.map(({ text, href, icon, children }, index) => (
                    <div key={text}>
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => {
                                    if (text === "Orders") {
                                        handleOrdersClick(index); // Pass index to handleOrdersClick
                                    } else if (children) {
                                        handleClick(index);
                                    } else {
                                        setSelectedItem(text);
                                        router.push(href);
                                    }
                                }}
                                className={`${selectedItem === "Orders" && text === "Orders"
                                    ? "!bg-red-600 !text-white"
                                    : currentPath === href
                                        ? "!bg-red-600 !text-white"
                                        : ""
                                    }`}
                            >
                                <ListItemIcon
                                    className={`${selectedItem === "Orders" && text === "Orders"
                                        ? "!text-white"
                                        : currentPath === href
                                            ? "!text-white"
                                            : ""
                                        }`}
                                >
                                    {icon}
                                </ListItemIcon>
                                <ListItemText primary={text} />
                                {children && (expandedItem === index ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemButton>

                        </ListItem>
                        {children && expandedItem === index && (
                            <List component="div" disablePadding>
                                {children.map((child) => (
                                    <ListItem key={child.Title} disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                setSelectedItem(text);
                                                router.push(child.path);
                                            }}
                                            className={`pl-4 ${currentPath === child.path ? "!bg-red-500 !text-white" : "!bg-red-400"
                                                }`}
                                        >
                                            <ListItemText primary={child.Title} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </div>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <Drawer open={open} onClose={() => { }} variant="persistent" className="adminpanel-component">
                {DrawerList}
            </Drawer>
        </>
    );
}
