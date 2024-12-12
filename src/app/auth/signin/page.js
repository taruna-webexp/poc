"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Grid, Grid2, Typography } from "@mui/material";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import { errorMsg, successMsg } from "@/component/Toastmsg/toaster";
import FormInput from "@/components/share/form/FormInput";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import { errorMsg, successMsg } from "@/components/msg/toaster";
const Login = () => {
    const { control, handleSubmit } = useForm();
    const [error, setError] = useState(null);
    const router = useRouter();
    const session = useSession()
    const onSubmit = async (data) => {
        const { email, password } = data;
        let credentialsArray = localStorage.getItem("credentials") || [];

        // Check if email and password match a registered user

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
                credentialsArray,
            });

            if (res.error) {
                errorMsg("Invalid credentials");
            } else {
                successMsg("Login Successfully")
                router.push("/admin/orders/allorders");
            }
        } catch (error) {
            errorMsg("Login Error");
        }
    };

    return (
        <Grid2
            container
            spacing={2}
            padding={2}
            className="min-h-screen justify-center items-center bg-red-100"
        >


            {/* Right Form Section */}
            {/* <Grid item xs={12} sm={12} md={12} className="flex justify-center"> */}

            <form onSubmit={handleSubmit(onSubmit)} className="w-2/5 bg-gray-100 px-8 py-8" >
                <div className="text-center">
                    <img src="/foody.webp" width="30%" className="authentication-logo" />
                    <Typography variant="h4" component="h1" className="font-bold">
                        <LocalDiningIcon fontSize="large" /> Food Prepation
                    </Typography>
                    <Typography variant="body2" className="text-gray-600">
                        Sign in as a cook to continue.
                    </Typography>
                </div>

                <div className="mt-10 mb-8 w-full">
                    <FormInput
                        control={control}
                        name="email"
                        inputType="email"
                        label="Email"
                        placeholder="demo@yopmail.com"
                        errors=""
                        className="text-white"
                    />
                </div>
                <div className="mt-4 mb-12">
                    <FormInput
                        control={control}
                        name="password"
                        inputType="password"
                        label="Password"
                        placeholder="12345"
                        errors=""
                        className=""
                    />
                </div>
                <div>
                    <Button
                        type="submit"
                        className="!bg-red-600 hover:bg-red-700 !text-white !font-bold cursor-pointer px-6 py-2 rounded-md transition duration-300 w-full"
                    >
                        Login
                    </Button>
                </div>
                <div className="text-center mt-6">
                    {error && <p className="text-red-500">{error}</p>}
                    <Typography variant="body2" className="mt-2">
                        Dont have an account?{" "}
                        <Link
                            href="/auth/signup"
                            className="text-red-600 hover:underline"
                        >
                            Sign up
                        </Link>
                    </Typography>
                </div>
            </form>

            {/* </Grid> */}
        </Grid2>
    );
};

export default Login;
