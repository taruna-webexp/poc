"use client";

import React from "react";
import { Controller } from "react-hook-form";

const CheckboxGroup = ({ name, options, control, setValue, toggleOrderItem, handleChangeCategory, selectedCategories }) => {
    console.log("selectedCategories11111", selectedCategories)
    return (
        <>
            {options.map((option) => (
                <div key={option.id} className="flex flex-col items-center">
                    <Controller
                        name={`${name}.${option.value}`}
                        control={control}
                        defaultValue={""}
                        render={({ field }) => (
                            <>
                                <input
                                    type="checkbox"
                                    {...field}
                                    color="success"
                                    checked={selectedCategories ? selectedCategories.includes(option.value) : field.value}

                                    onChange={(e) => {
                                        field.onChange(e.target.checked);
                                        handleChangeCategory(e, option)
                                        if (toggleOrderItem) {
                                            toggleOrderItem([option]);
                                        }
                                    }}
                                    className={`${name !== "mealCategory" ? "hidden" : ""} w-full !h-6`}
                                />
                                {name !== "mealCategory" &&
                                    <img
                                        src={option.image}
                                        alt={`${option.label} Meal`}
                                        onClick={() => {
                                            if (name === "mealCategory") {
                                                field.onChange(option.value);
                                            } else {
                                                setValue(`${name}.${option.value}`, !field.value);
                                            }
                                        }}
                                        width="35%"
                                        className={`object-cover rounded-md shadow-md mb-2 cursor-pointer ${field.value && name !== "mealCategory" ? "ring-8 ring-green-500 ring-offset-4" : ""
                                            }`}
                                    />
                                }
                                <label
                                    htmlFor={option.value}
                                    className={`text-xl font-bold ${selectedCategories && selectedCategories.includes(option.value) ? "text-green-600" : "text-gray-600"}
                                        `}
                                >
                                    {option.label}
                                </label>
                            </>
                        )}
                    />
                </div>
            ))}
        </>
    );
};

export default CheckboxGroup;
