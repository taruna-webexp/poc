"use client";

import React, { useState } from "react";
import { Controller } from "react-hook-form";

const CheckboxGroup2 = ({ name, options, control, setValue, toggleOrderItem }) => {
    const [selectedValues, setSelectedValues] = useState({}); // Track selected items

    const handleImageClick = (option, field) => {
        const newValue = !field.value;
        setValue(`${name}.${option.value}`, newValue); // Update react-hook-form value
        setSelectedValues((prev) => ({
            ...prev,
            [option.value]: newValue, // Track selection in local state
        }));
        toggleOrderItem(option); // Synchronize state with toggle
    };

    return options.map((option) => (
        <div key={option.value} className="flex flex-col items-center">
            <Controller
                name={`${name}.${option.value}`}
                control={control}
                defaultValue={false}
                render={({ field }) => {
                    return (
                        <>
                            <input
                                type="checkbox"
                                {...field}
                                checked={field.value}
                                onChange={(e) => {
                                    field.onChange(e.target.checked);
                                    toggleOrderItem(option);
                                }}
                            />

                            <img
                                width="25%"
                                src={option.image}
                                alt={`${option.label} Meal`}
                                onClick={() => handleImageClick(option, field)} // Use the handler
                                className={`h-full object-cover rounded-md shadow-md mb-2 cursor-pointer ${selectedValues[option.value] || field.value
                                    ? "ring-8 ring-green-500 ring-offset-4"
                                    : ""
                                    }`}
                            />

                            <label
                                htmlFor={option.value}
                                className={`text-4xl font-bold ${field.value ? "text-green-600" : "text-gray-600"}`}
                            >
                                {option.label}
                            </label>
                        </>
                    )
                }}
            />
        </div>
    ));
};

export default CheckboxGroup2;
