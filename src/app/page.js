"use client";
import CheckboxGroup from "@/components/share/form/CheckboxGroup";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, Controller } from "react-hook-form";

const Home = () => {
  const { control, handleSubmit } = useForm();
  const router = useRouter()
  const onSubmit = (data) => {
    const obj = data.checkboxGroup
    const mealCategory = Object.keys(obj).find(key => obj[key] === true);
    console.log(mealCategory); // data will include the checked values of each checkbox
    router.push(`/meal/?category=${mealCategory}`);
  };

  const options = [
    { value: "veg", label: "Veg", image: "/assets/veg.avif" },
    { value: "non", label: "Non-Veg", image: "/assets/checken.webp" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800">Choose Your Meal</h1>

      {/* Checkbox Group */}
      <div className="flex justify-center gap-8 mb-6">

        <CheckboxGroup name="checkboxGroup" options={options} control={control} />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-8 py-3 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Home;
