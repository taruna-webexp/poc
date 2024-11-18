"use client";

import CheckboxGroup from "@/components/share/form/CheckboxGroup";
import RadioButtonsGroup from "@/components/share/form/RadioButton";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const Home = () => {
  const { control, handleSubmit, setValue } = useForm();
  const router = useRouter();

  const onSubmit = (data) => {

    // const obj = data.checkboxGroup;
    const mealCategory = data.mealCategory
    console.log("data", data);
    router.push(`/meal/?category=${mealCategory}`);
  };

  const mealCategoryoptions = [
    { value: "veg", label: "Veg", image: "/assets/v.webp" },
    { value: "non", label: "Non-Veg", image: "/assets/meat.webp" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800">Choose Your Meal</h1>

      <div className="flex justify-center gap-8 mb-6">
        <RadioButtonsGroup name="mealCategory" options={mealCategoryoptions} control={control} />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="px-8 py-3 bg-red-600 text-white rounded-md shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Home;
