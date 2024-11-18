import { FormControl } from "@mui/material";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";

export default function FormInput({
    name,
    control,
    errors,
    label,
    inputType,
    className,
    defaultValue,
    placeholder,
}) {
    return (
        <FormControl fullWidth className={className}>
            <Controller
                name={name}
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <TextField
                        {...field}
                        InputLabelProps={{ shrink: true }}
                        fullWidth

                        label={label}
                        placeholder={placeholder}
                        type={inputType}
                        // error={!!errors[name]}
                        // helperText={errors[name]?.message}
                        variant="outlined"
                    />
                )}
            />
        </FormControl>
    );
}
