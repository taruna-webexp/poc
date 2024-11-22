"use client"
import React from "react";

import { Typography } from "@mui/material";

function LayoutHeader({ pageTitle }) {
    return (
        <Typography
            variant="span"
            className="text-4xl !mt-6 font-semibold pb-1 px-6 text-1xl inline-block"
        >
            {pageTitle}
        </Typography>
    );
}

export default LayoutHeader;