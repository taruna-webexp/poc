"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Grid, Typography, List, ListItem, ListItemText, ListItemAvatar } from "@mui/material";
import { successMsg } from "@/components/msg/toaster";
import LayoutHeader from "./layoutHearTitle";
import { meals as initialMeals } from "@/service/mealData";
import CheckboxGroup from "@/components/share/form/CheckboxGroup";

const Home = () => {
  const { control, handleSubmit, setValue } = useForm();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [mealCategoryValue, setMealCategoryValue] = useState(null);
  const [meals, setMeals] = useState(initialMeals);
  const [orderData, setOrderData] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Meal category options
  const mealCategoryOptions = [
    { id: 1, value: "veg", label: "Veg" },
    { id: 2, value: "non", label: "Non-Veg" },
  ];

  // Ensure client-side checks for localStorage usage
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get query parameter from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category"); // Access category from query parameters
    if (category) {
      const categories = category.split(",");
      setMealCategoryValue(category);
      setSelectedCategories(categories);
    }
  }, []); // This effect runs only once on component mount

  // Handle category change and update URL query parameter
  const handleChangeCategory = (e, option) => {
    const isChecked = e.target.checked;
    let updatedCategories = [...selectedCategories];

    if (isChecked) {
      updatedCategories.push(option.value);
    } else {
      updatedCategories = updatedCategories.filter((cat) => cat !== option.value);
    }

    setSelectedCategories(updatedCategories);

    // Update the query parameter in the URL
    const updatedQuery = updatedCategories.length > 0 ? updatedCategories.join(",") : "";
    const newUrl = `${window.location.pathname}?category=${updatedQuery}`;
    window.history.pushState({ path: newUrl }, "", newUrl); // Update URL without reloading the page
  };

  // Filter meals based on selected categories
  useEffect(() => {
    if (selectedCategories.length > 0) {
      setMeals(initialMeals.filter((meal) => selectedCategories.includes(meal.type)));
    } else {
      setMeals(initialMeals);
    }
  }, [selectedCategories]);


  //item select toggel
  const toggleOrderItem = (meal) => {
    const isAlreadyInOrder = orderData.some(orderItem => orderItem.id === meal.id);
    const updatedOrderData = isAlreadyInOrder
      ? orderData.filter(orderItem => orderItem.id !== meal.id) // Remove
      : [...orderData, meal]; // Add
    setOrderData(updatedOrderData);
    if (isClient) {
      localStorage.setItem("orderDataList", JSON.stringify(updatedOrderData));
      localStorage.setItem("orderplaceList", JSON.stringify(updatedOrderData));
    }
  };





  // Place order handler
  const placeOrderHandler = () => {
    successMsg(`Your order has been added to the cart`);
    if (isClient) {
      localStorage.setItem("cartDatalength", JSON.stringify(orderData));
      window.location.replace("/cart");
      localStorage.removeItem("orderDataList");
    }
  };

  return (
    <Grid container maxWidth="lg" spacing={2} className="home-container mt-4">
      <LayoutHeader pageTitle="All Menu Items" />
      <Grid item xs={12}>
        <form onSubmit={handleSubmit(() => { })} className="bg-gradient-to-br from-gray-100 to-gray-300 shadow-xl rounded-lg p-6">
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
        <Grid container spacing={2}>
          {meals.map((meal) => (
            <Grid item xs={12} sm={6} md={4} key={meal.id}>
              <List sx={{ borderRadius: 2, boxShadow: 1, overflow: 'hidden' }}>
                <ListItem>
                  <div style={{ textAlign: 'center' }}>

                    <CheckboxGroup
                      name={meal.name}
                      options={[meal]}
                      control={control}
                      setValue={(name, value) => {
                        setValue(name, value);
                        toggleOrderItem(meal);
                      }}
                    />
                    <Typography variant="h6" component="div">
                      {meal.name}
                    </Typography>
                    <Typography variant="h6" component="div">
                      ${meal.price}
                    </Typography>
                    <Typography variant="h6" component="div">
                      {meal.type === "veg" ? "Vegetarian" : "Non-Vegetarian"}
                    </Typography>
                  </div>
                </ListItem>
              </List>
            </Grid>
          ))}
        </Grid>
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
          {orderData.length === 0 ? "No items" : "Add to cart"}
        </Button>
      </Grid>
    </Grid>

  );
};

export default Home;
