'use client';

import React from "react";
import { Controller } from "react-hook-form";

const CheckboxGroup = ({ name, options, control }) => {
    return (
        options.map((option) => (
            <div key={option.value} className="flex flex-col items-center">
                {/* Image */}
                <img
                    src={option.image}
                    alt={`${option.label} Meal`}
                    className="w-32 h-32 object-cover rounded-md shadow-md mb-2"
                />

                <Controller
                    name={`${name}.${option.value}`} // Unique name for each checkbox
                    control={control}
                    defaultValue={false} // Default value set to false (unchecked)
                    render={({ field }) => (
                        <input
                            type="checkbox"
                            {...field}
                            checked={field.value} // Ensure the checkbox is checked if its value is true
                            onChange={(e) => field.onChange(e.target.checked)} // Handle the checkbox change event
                            value={option.value} // Ensure each checkbox has its unique value
                        />
                    )}
                />




                <label htmlFor={option.value} className="text-lg font-medium text-gray-600">
                    {option.label}
                </label>
            </div>
        ))
    )
};

export default CheckboxGroup;
