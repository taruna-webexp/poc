import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

export default function DatePicker({ name, control }) {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['SingleInputDateRangeField']}>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <DateRangePicker
                            {...field} // Pass field props to DateRangePicker
                            slots={{ field: SingleInputDateRangeField }}
                        />
                    )}
                />
            </DemoContainer>
        </LocalizationProvider>
    );
}
