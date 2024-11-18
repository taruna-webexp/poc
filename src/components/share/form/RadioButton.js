import React from 'react';
import { Controller } from 'react-hook-form';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

const RadioButtonsGroup = ({ control, options }) => {
    return (
        <FormControl component="fieldset">
            <Controller
                name="mealCategory"
                control={control}
                defaultValue="veg"
                render={({ field }) => (
                    <RadioGroup
                        aria-labelledby="meal-category-label"
                        name="mealCategory"
                        value={field.value}
                        onChange={field.onChange}
                    >
                        <div className="flex flex-row space-x-4">
                            {options.map((option) => (
                                <React.Fragment key={option.value}>
                                    <FormControlLabel
                                        value={option.value}
                                        control={<Radio />}
                                        className="!hidden"
                                    />
                                    <div
                                        className={`flex flex-col items-center cursor-pointer 
                                            ${field.value === option.value ? 'ring-8 ring-green-500 ring-offset-4' : ''}
                                        `}
                                        onClick={() => field.onChange(option.value)}
                                    >
                                        <img
                                            src={option.image}
                                            alt={option.label}
                                            className="w-full h-full object-cover rounded-md shadow-md mb-2"
                                        />
                                        <span className="text-3xl">{option.label}</span>
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </RadioGroup>
                )}
            />
        </FormControl>
    );
};

export default RadioButtonsGroup;
