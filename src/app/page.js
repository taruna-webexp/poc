"use client";

import CheckboxGroup from "@/components/share/form/CheckboxGroup";
import { meals as initialMeals } from "@/service/mealData";
import { Button, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import LayoutHeader from "./layoutHearTitle";

const Home = () => {
  const { control, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mealCategoryValue, setMealCategoryValue] = useState(null)
  useEffect(() => {
    // Ensure searchParams is accessed only on the client side
    const category = searchParams.get("category");
    setMealCategoryValue(category);
  }, [searchParams]); // Update when
  const [meals, setMeals] = useState(initialMeals);
  const [orderData, setOrderData] = useState(() => {
    const savedData = localStorage.getItem("orderDataList");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [totalPrice, setTotalPrice] = useState(0);

  const [check, setCheck] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState(["veg", "non"]);
  console.log("selected", selectedCategories)
  // Handle checkbox changes
  const handleChangeCategory = (e, option) => {
    const isChecked = e.target.checked;
    let updatedCategories;

    if (isChecked) {
      // Add the selected option to the list
      updatedCategories = [...selectedCategories, option.value];
    } else {
      // Remove the unselected option from the list
      updatedCategories = selectedCategories.filter((cat) => cat !== option.value);

      // If no categories are selected, automatically select the other option
      if (updatedCategories.length === 0) {
        const otherOption = mealCategoryOptions.find((opt) => opt.value !== option.value);
        console.log("otherOption", otherOption)
        updatedCategories = [otherOption.value];
      }
    }

    setSelectedCategories(updatedCategories);

    if (updatedCategories.length > 0) {
      // Update the URL query params
      const queryParams = updatedCategories.join(",");
      router.push(`/?category=${queryParams}`);
    }
  };


  // Filter meals based on selected categories
  useEffect(() => {
    if (selectedCategories.length > 0) {
      setMeals(initialMeals.filter((meal) => selectedCategories.includes(meal.type)));
    } else {
      setMeals(initialMeals);
    }
  }, [selectedCategories]);

  const mealCategoryOptions = [
    { id: 1, value: "veg", label: "Veg" },
    { id: 2, value: "non", label: "Non-Veg" },
  ];

  useEffect(() => {
    // Update total price whenever orderData changes
    const calculateTotalPrice = () => {
      const total = orderData.reduce((total, item) => total + item.price * item.quantity, 0);
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [orderData]);

  //urlquery condition data
  useEffect(() => {
    if (mealCategoryValue) {
      const categories = mealCategoryValue.split(",");
      if (categories.includes("veg") && categories.includes("non")) {
        setMeals(initialMeals); // Show all meals
      } else {
        setMeals(initialMeals.filter(meal => categories.includes(meal.type)));
      }
    } else {
      setMeals(initialMeals); // Show all meals by default
    }
  }, [mealCategoryValue]);

  //item select toggel
  const toggleOrderItem = (meal) => {
    const isAlreadyInOrder = orderData.some(orderItem => orderItem.id === meal.id);
    const updatedOrderData = isAlreadyInOrder
      ? orderData.filter(orderItem => orderItem.id !== meal.id) // Remove
      : [...orderData, meal]; // Add

    setOrderData(updatedOrderData);
    const newOrderData = {
      date: new Date().toISOString(),
      items: updatedOrderData,
    };


    localStorage.setItem("orderDataList", JSON.stringify(updatedOrderData));

    localStorage.setItem("orderplaceList", JSON.stringify(updatedOrderData));
  };



  //quantity  function
  const handleQuantity = (mealId, type) => {
    setMeals(prevMeals =>
      prevMeals.map(meal => {
        if (meal.id === mealId) {
          const newQuantity = type === "icr" ? meal.quantity + 1 : Math.max(meal.quantity - 1, 1);
          return { ...meal, quantity: newQuantity };
        }
        return meal;
      })
    );
  };



  //order place function
  const placeOrderHandler = () => {
    alert(`Your order has been placed! Total: $${totalPrice.toFixed(2)}`);
    router.push("/payment")
    localStorage.removeItem("orderDataList")
  };



  return (<>
    <Grid container maxWidth="lg" spacing={2} className=" home-container mt-4" >
      <LayoutHeader pageTitle="All Menu Items" />
      <Grid item xs={12}>
        <form
          onSubmit={handleSubmit(() => { })}
          className="bg-gradient-to-br from-gray-100 to-gray-300 shadow-xl rounded-lg p-6 "
        >
          <Typography variant="h4" align="center" className="text-gray-800 font-bold mb-2">
            Choose Your Meal Category
          </Typography>

          <div className="flex justify-center gap-4">
            <CheckboxGroup
              name="mealCategory"
              options={mealCategoryOptions}
              control={control}
              handleChangeCategory={handleChangeCategory}
              setValue={setValue}
              selectedCategories={selectedCategories}
            />
          </div>

        </form>
      </Grid>


      <Grid item xs={12} sm={12} md={12}>
        {meals.map(meal => (
          <List sx={{ borderRadius: 2, boxShadow: 1 }} key={meal.id}>
            <ListItem>
              <ListItemAvatar>
                <CheckboxGroup
                  name={meal.name}
                  options={[meal]}
                  control={control}
                  setValue={(name, value) => {
                    setValue(name, value);
                    toggleOrderItem(meal);
                  }}
                />
              </ListItemAvatar>
              <ListItemText>
                <Typography variant="h6" component="div" noWrap>
                  {meal.name}
                </Typography>
              </ListItemText>
              <ListItemText>
                <Typography variant="h6" component="div" noWrap>
                  ${meal.price}
                </Typography>
              </ListItemText>
              <ListItemText>
                <Typography variant="h6" component="div" noWrap>
                  {meal.type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
                </Typography>
              </ListItemText>
              <ListItemText>
                <div className="flex items-center space-x-2 mt-2">
                  <Typography variant="body2">Quantity:</Typography>
                  <Button
                    onClick={() => handleQuantity(meal.id, "icr")}
                    sx={{
                      minWidth: 24,
                      height: 24,
                      padding: 0,
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      borderRadius: '50%',
                      '&:hover': { backgroundColor: '#388e3c' }
                    }}
                  >
                    +
                  </Button>
                  <input
                    type="number"
                    value={meal.quantity}
                    onChange={(e) =>
                      setMeals(prevMeals =>
                        prevMeals.map(m =>
                          m.id === meal.id ? { ...m, quantity: Math.max(Number(e.target.value), 1) } : m
                        )
                      )
                    }
                    style={{
                      width: '40px',
                      textAlign: 'center',
                      fontSize: '14px',
                      padding: '5px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                    }}
                  />
                  <Button
                    onClick={() => handleQuantity(meal.id, "dec")}
                    sx={{
                      minWidth: 24,
                      height: 24,
                      padding: 0,
                      backgroundColor: '#f44336',
                      color: '#fff',
                      borderRadius: '50%',
                      '&:hover': { backgroundColor: '#d32f2f' }
                    }}
                  >
                    -
                  </Button>
                </div>
              </ListItemText>
            </ListItem>
          </List>
        ))}
      </Grid>
      <Grid className="order-button-container mt-4 w-full">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={orderData.length === 0}
          sx={{
            marginTop: 2,
            padding: '12px',
            fontSize: '14px',
            backgroundColor: '#D32F2F',
            color: '#fff',
            "&:hover": { backgroundColor: "#c62828" },
          }}
          onClick={placeOrderHandler}
        >
          {orderData.length === 0
            ? "No items in your order"
            : `${totalPrice ? `$${totalPrice.toFixed(2)}` : ""} Place Order`}
        </Button>
      </Grid>
    </Grid >
  </>
  );
};

export default Home;
