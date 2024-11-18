"use client";

import React from "react";
import { Controller } from "react-hook-form";

const CheckboxGroup = ({ name, options, control, setValue, toggleOrderItem }) => {


    return (


        options.map((option) => (
            <div key={option.value} className="flex flex-col items-center">
                <Controller
                    name={`${name}.${option.value}`}
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                        <>
                            <input
                                type="checkbox"
                                {...field}
                                checked={field.value}
                                onChange={(e) => {
                                    field.onChange(e.target.checked)
                                    toggleOrderItem(option)
                                }
                                }
                                className="hidden"
                            />

                            <img
                                src={option.image}
                                alt={`${option.label} Meal`}
                                onClick={() => {
                                    setValue(`${name}.${option.value}`, !field.value);
                                }}
                                className={`w-full h-full object-cover rounded-md shadow-md mb-2 cursor-pointer ${field.value ? "ring-8 ring-green-500 ring-offset-4" : ""
                                    }`}
                            />

                            <label
                                htmlFor={option.value}
                                className={`text-4xl font-bold ${field.value ? "text-green-600" : "text-gray-600"}`}
                            >
                                {option.label}
                            </label>
                        </>
                    )}
                />
            </div>
        ))

    );
};

export default CheckboxGroup;
