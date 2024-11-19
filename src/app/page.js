"use client";

import CheckboxGroup from "@/components/share/form/CheckboxGroup";
import { meals as initialMeals } from "@/service/mealData";
import { Button, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Home = () => {
  const { control, handleSubmit, setValue } = useForm();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mealCategoryValue = searchParams.get("category");
  const [meals, setMeals] = useState(initialMeals);
  const [orderData, setOrderData] = useState(() => {
    const savedData = localStorage.getItem("orderDataList");
    return savedData ? JSON.parse(savedData) : [];
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    // Update total price whenever orderData changes
    const calculateTotalPrice = () => {
      const total = orderData.reduce((total, item) => total + item.price * item.quantity, 0);
      setTotalPrice(total);
    };
    calculateTotalPrice();
  }, [orderData]);

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

  const toggleOrderItem = (meal) => {
    const isAlreadyInOrder = orderData.some(orderItem => orderItem.id === meal.id);
    const updatedOrderData = isAlreadyInOrder
      ? orderData.filter(orderItem => orderItem.id !== meal.id) // Remove
      : [...orderData, meal]; // Add

    setOrderData(updatedOrderData);
    localStorage.setItem("orderDataList", JSON.stringify(updatedOrderData));
  };

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

  const onSubmit = (data) => {
    const mealCategory = data.mealCategory;
    const mealCategoryURL = Object.keys(mealCategory).filter(key => mealCategory[key]);
    router.push(`/?category=${mealCategoryURL.join(",")}`);
  };

  const mealCategoryoptions = [
    { id: 1, value: "veg", label: "Veg", image: "/assets/v.webp" },
    { id: 2, value: "non", label: "Non-Veg", image: "/assets/meat.webp" },
  ];

  const placeOrderHandler = () => {
    alert(`Your order has been placed! Total: $${totalPrice.toFixed(2)}`);
    router.push("/payment")
  };

  return (
    <>
      <Grid container spacing={2} maxWidth="xl" className="mt-8 item-listing-container">
        <Grid item xs={12} md={12}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-gradient-to-br from-gray-100 to-gray-300 shadow-xl rounded-lg p-6 space-y-6"
          >
            <Typography variant="h4" component="h1" align="center" className="text-gray-800 font-bold mb-2">
              Choose Your Meal Category
            </Typography>
            <Typography variant="body1" align="center" className="text-gray-600">
              Explore a variety of options to match your preferences.
            </Typography>

            <div className="grid grid-cols-2 gap-4">
              {mealCategoryoptions.map(option => (
                <div key={option.value} className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition duration-300">
                  <CheckboxGroup
                    defaultChecked
                    name="mealCategory"
                    options={[option]}
                    control={control}
                    setcategoryData={setValue}
                    className="flex items-center"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  backgroundColor: "#FF5722",
                  "&:hover": {
                    backgroundColor: "#E64A19",
                  },
                }}
              >
                Find Meals
              </Button>
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
      </Grid>
    </>
  );
};

export default Home;
