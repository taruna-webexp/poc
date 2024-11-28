"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Grid, Grid2, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FormInput from "@/components/share/form/FormInput";
import { signIn } from "next-auth/react";
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import LayoutHeader from "@/app/layoutHearTitle";
import { errorMsg, successMsg } from "@/components/msg/toaster";
const Register = () => {
  const { control, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    // Get the existing credentials from localStorage (if any) and ensure it's an array
    let credentialsArray1 =
      JSON.parse(localStorage.getItem("credentials")) || [];

    // Create a new user object based on the registration form data
    const newUser = {
      email: data.email,
      password: data.password,
    };

    // Check if the email already exists
    const emailExists = credentialsArray1.some(
      (user) => user.email === data.email
    );
    if (emailExists) {
      errorMsg("Email already registered");

      return;
    }

    // Add the new user's credentials to the existing array
    credentialsArray1.push(newUser);

    // Store the updated array of credentials in localStorage
    localStorage.setItem("credentials", JSON.stringify(credentialsArray1));

    try {
      const res = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        credentialsArray: localStorage.getItem("credentials") || [],
      });

      if (res?.error) {

        errorMsg(res.error);
      } else {
        successMsg("Registeration Successfully");
        router.push("/admin/orders/allorders");
      }
    } catch (err) {
      // Set the error message to be a string
      errorMsg(err.message || "An unexpected error occurred");
      // errorMsg(err);
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



      <form onSubmit={handleSubmit(onSubmit)} className="w-2/5 bg-gray-100 px-8 py-8" >
        <div className="text-center">
          <img src="/foody.webp" width="30%" className="authentication-logo" />

          <Typography variant="h4" component="h1" className="font-bold">
            <LocalDiningIcon fontSize="large" /> Register cook
          </Typography>
          <Typography variant="body2" className="text-gray-600">
            Sign up to continue.
          </Typography>
        </div>

        <div className="mt-10 mb-8">
          <FormInput
            control={control}
            name="email"
            inputType="email"
            label="Email"
            defaultValue=""
            placeholder="demo@yopmail.com"
            errors=""
            className=""
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
            defaultValue=""

            className=""
          />
        </div>
        <div>
          <Button
            type="submit"
            className="!bg-red-600 hover:bg-red-700 !text-white !font-bold cursor-pointer px-6 py-2 rounded-md transition duration-300 w-full"
          >
            Register
          </Button>
        </div>
        <div className="text-center mt-6">

          <Typography variant="body2" className="mt-2">
            You have an account?
            <Link
              href="/auth/signin"
              className="text-red-600 hover:underline"
            >
              Sign in
            </Link>
          </Typography>
        </div>
      </form>

    </Grid2>
  );
};

export default Register;
