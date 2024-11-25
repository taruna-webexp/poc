"use client";

import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Controller } from "react-hook-form";

export default function BasicDatePicker({ name, control, minDate, maxDate }) {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <DatePicker
                        {...field}
                        label={name === "startDateRange" ? "Start Date" : "End Date"}
                        minDate={minDate}
                        maxDate={maxDate}
                        format="YYYY-MM-DD" // Optional formatting for display
                        slotProps={{
                            textField: {
                                variant: "outlined",
                                fullWidth: true,
                            },
                        }}
                    />
                )}
            />
        </LocalizationProvider>
    );
}
