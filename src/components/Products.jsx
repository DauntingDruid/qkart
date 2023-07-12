import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import Stack from '@mui/material/Stack';
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import { useNavigate } from 'react-router-dom';
import ProductCard from "./ProductCard";
import Cart,{generateCartItemsFrom} from "./Cart"

//



const Products = () => {
  console.log("ROUTING TO PRODUCTS")
  const { enqueueSnackbar } = useSnackbar();
  //to show loading state
  const [load, setload] = useState(false);
  //to hold data of products searched to be displayed
  const [displayproducts,setdisplayproducts] = useState([]);
  //timeout for debouncing
  const [debounceTimeout, setDebounceTimeout] = useState(0)
  //get user token
  const token = localStorage.getItem('token');
  //to store all products data
  const [allProducts, setallProducts] = useState([]);
  //cart items
  const [cartItems, setcartItems] = useState([]);

  useEffect(() => {
    //call api
    const data = performAPICall();
  },[]);

  useEffect(() => {
    if(token){
    const fetchedCartItems = fetchCart(token);
        const cartItemsDetail = generateCartItemsFrom(fetchedCartItems.data, allProducts);
        //displaycart
        setcartItems(cartItemsDetail);
      }
  },[allProducts]);

  console.log('Products available: ',allProducts);

  // Fetching products data and storing it
  const performAPICall = async () => {
    // console.log("fetching products <--")
    let res
    setload(true);
    try{
      res = await axios.get(`${config.endpoint}/products`);
      setload(false);
    }
    catch (error) {
      setload(false);
      enqueueSnackbar("Something went wrong. Check the backend console for more details",{ variant: "error" });
      console.log(error);
      return
    }
    // console.log("products recieved : ",res)
    //to show all products
    setdisplayproducts(res.data); 
    //store products data
    setallProducts(res.data);

  };

  // search logic
  const performSearch = async (text) => {
    console.log("performing search")
    setload(true);
    try{
      const searchedProducts = await axios.get(`${config.endpoint}/products/search?value=${text.target.value}`);
      setload(false);
      setdisplayproducts(searchedProducts.data);
      return searchedProducts;
    }
    catch (error) {
      setload(false);
      setdisplayproducts([]);
      enqueueSnackbar("No products found",{ variant: "error" });
      console.log(error);
    }
  };

  /**
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   */
  const debounceSearch = (event, debounceTout) => {
    if (debounceTimeout !== 0) {
      // clear the timeout
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => performSearch(event), 500);
    setDebounceTimeout(newTimeout);
  };


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    console.log("fetching cart")
    if (!token) return;

    try {
      // Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const fetchCart = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return fetchCart;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };



  // Return if a product already is present in the cart
  const isItemInCart = (items, productId) => {
    var match = false;
    console.log("IinC",items);
    console.log("IinC",productId);

    items.map((product) => {
          if(product._id === productId){
              match = true;
          }
      })

    return match;
   };


  //Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
  const addToCart = async (token,items,products,productId,qty,options = { preventDuplicate: false }) => {
    console.log("Called from addToCart");
    console.log("atc",items);
    console.log("atc",productId);
    if (!token) {
      enqueueSnackbar("Login to add an item to the Cart.", {
        variant: "warning",
      });
      return;
    }

    if (options.preventCallFromCart && isItemInCart(items, productId)) {
      enqueueSnackbar(
        "Item already in cart. Use the cart sidebar to update quantity or remove item.",
        { variant: "warning" }
      );
      return;
    }else {
        try {
            console.log("post req");
          const response = await axios.post(
            `${config.endpoint}/cart`,
            { productId, qty },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
    
          const newCartItems = generateCartItemsFrom(response.data, products);
          setcartItems(newCartItems);
        } catch (error) {
          if (error.response) {
            enqueueSnackbar(error.response.data.message, { variant: "error" });
          } else {
            enqueueSnackbar(
              "Could not fetch products. Check that the backend is running, reachable and return valid JSON.",
              { variant: "error" }
            );
          }
        }
    }
  };

  //to get - + buttons of cart items working
  const handleQuantity=(id, qty)=>{    
    addToCart(token,cartItems,allProducts,id,qty);
  }


  return (
    <div>
      

      <Header >

      {/* Search view for desktop */}
      <TextField
        onChange={(e) => debounceSearch(e)}
        className="search-desktop searchbar-width"
        size="large"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        onChange={(e) => debounceSearch(e)}
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
      />

      <Grid container>
        <Grid item xs={12} md={token ? 9 : 12}>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                  to your door step
                </p>
              </Box>
            </Grid>
          </Grid>
          
          <Grid container alignItems="center" justifyContent="center" spacing={1} padding={2}>
            { 
            load ?(
              <Stack height="50vh" alignItems="center" justifyContent="center" spacing={1}>
                <CircularProgress color="success" />
                <p className="loading-text">Loading Products...</p>
              </Stack>
              )
              :
              (<>
                {
                  displayproducts?.map((productDetails) => (
                  <Grid item xs={6} md={3} key={productDetails._id}>
                    <ProductCard product={productDetails} handleAddToCart={() =>
                        addToCart(token, cartItems, allProducts, productDetails._id, 1, {preventCallFromCart : true})}/>
                  </Grid>))
                }
              </>
              )  
            } 
          </Grid>
        </Grid>
          
        {
          token ? (
            <Grid item xs={12} md={3}>
              <Cart products={allProducts} items={cartItems} handleQuantity={handleQuantity} />
            </Grid>
          )
          : null
        }
      </Grid>
          
      <Footer />
    </div>
  );
};

export default Products;


