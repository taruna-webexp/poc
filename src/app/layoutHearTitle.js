"use client"
import React from "react";

import { Grid, Typography } from "@mui/material";

function LayoutHeader({ pageTitle }) {
    return (
        <Grid container maxWidth="lg" spacing={2} className=" home-container mt-4" >

            <Typography
                variant="span"
                className="text-4xl !mt-6 font-semibold pb-1  text-1xl inline-block"
            >
                {pageTitle}
            </Typography></Grid>

    );
}

export default LayoutHeader;