import { CreditCard, Delete } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { config } from "../App";
import Cart, { getTotalCartValue, generateCartItemsFrom } from "./Cart";
import "./Checkout.css";
import Footer from "./Footer";
import Header from "./Header";
//
import DeleteIcon from '@mui/icons-material/Delete';

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 *
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * @typedef {Object} Address - Data on added address
 *
 * @property {string} _id - Unique ID for the address
 * @property {string} address - Full address string
 */

/**
 * @typedef {Object} Addresses - Data on all added addresses
 *
 * @property {Array.<Address>} all - Data on all added addresses
 * @property {string} selected - Id of the currently selected address
 */

/**
 * @typedef {Object} NewAddress - Data on the new address being typed
 *
 * @property { Boolean } isAddingNewAddress - If a new address is being added
 * @property { String} value - Latest value of the address being typed
 */

/**
 * type a new address in the text field and add the new address or cancel adding new address
 * Returns the complete data on all products in cartData by searching in productsData
 */
const AddNewAddressView = ({
  token,
  newAddress,
  handleNewAddress,
  addAddress,
}) => {
  return (
    <Box display="flex" flexDirection="column">
      <TextField
        multiline
        minRows={4}
        placeholder="Enter your complete address"
        onChange={(e) => newAddress.value = e.target.value}
      />
      <Stack direction="row" my="1rem">
        <Button
          variant="contained"
          onClick={() => 
          //console.log(newAddress)
          addAddress(token,newAddress.value)
          }
        >
          Add
        </Button>
        <Button
          variant="text"
          onClick={() => handleNewAddress({isAddingNewAddress: false,value: ""})}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );
};

const Checkout = () => {
  const token = localStorage.getItem("token");
  const history = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [addresses, setAddresses] = useState({ all: [], selected: "" });
  const [newAddress, setNewAddress] = useState({
    isAddingNewAddress: false,
    value: "",
  });

  // Fetch the entire products list
  const getProducts = async () => {
    try {
      const response = await axios.get(`${config.endpoint}/products`);

      setProducts(response.data);
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // Fetch cart data
  const fetchCart = async (token) => {
    if (!token) return;
    try {
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  // Fetch list of addresses for a user
  const getAddresses = async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(`${config.endpoint}/user/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses({ ...addresses, all: response.data });
      return response.data;
    } catch {
      enqueueSnackbar(
        "Could not fetch addresses. Check that the backend is running, reachable and returns valid JSON.",
        {
          variant: "error",
        }
      );
      return null;
    }
  };

  //Handler function to add a new address and display the latest list of addresses
  const addAddress = async (token, newAddress) => {
    try {
      //- Add new address to the backend and display the latest list of addresses     
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
      const response = await axios.post(
        `${config.endpoint}/user/addresses`,
        { address: newAddress },
        {
          headers: headers
        }
      );
      console.log(response);
      //to display new address in list
      setAddresses({ ...addresses, all: response.data });
      //reset the newAddress state so that <AddNewAddressView> isn’t displayed if the address was added successfully
      setNewAddress({ isAddingNewAddress: false, value: "", });
      return response;
    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not add this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  }

  //  * Handler function to delete an address from the backend and display the latest list of addresses
  const deleteAddress = async (token, addressId) => {
    try {
      console.log(addressId);
      // Delete selected address from the backend and display the latest list of addresses
      const headers = {
        'Accept': 'application/json text/plain */*',
        'Authorization': `Bearer ${token}`
      }
      const response = await axios.delete(
        `${config.endpoint}/user/addresses/${addressId}`,
        {
          headers: headers
        }
      );

      //to display new address in list
      setAddresses({ ...addresses, all: response.data });

      return response;

    } catch (e) {
      if (e.response) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not delete this address. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
  };

  // * Return if the request validation passed. If it fails, display appropriate warning message.
  const validateRequest = (items, addresses) => {
    let passed = true;

    const cartValue = getTotalCartValue(items);
    if(cartValue > localStorage.getItem("balance")){
      enqueueSnackbar("You do not have enough balance in your wallet for this purchase", { variant: 'warning'})
      passed = false;
    }else if(!addresses){
      enqueueSnackbar("Please add a new address before proceeding.", { variant: 'warning'})
      passed = false;    
    }else if(!addresses.selected){
      enqueueSnackbar("Please select one shipping address to proceed.", { variant: 'warning'})
      passed = false;      
    }

    return passed;
  };

  // * Handler function to perform checkout operation for items added to the cart for the selected address
  const performCheckout = async (token, items, addresses) => {
    const validated = validateRequest(items,addresses);
    if(validated){
      try{

        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
        const response = await axios.post(
          `${config.endpoint}/cart/checkout`,
          {addressId: addresses.selected},
          {
            headers: headers
          }
        );

        const walletAmount = localStorage.getItem("balance") - getTotalCartValue(items);
        console.log(walletAmount);
        localStorage["balance"] = walletAmount;

        enqueueSnackbar("Order placed successfully", {variant: 'success'});
        history("/thanks");
        
        return response;
      }catch(err){
        enqueueSnackbar(err.message, {variant: 'error'});
      }
    }
  };

  // Fetch addressses if logged in, otherwise show info message and redirect to Products page
  if(!token){
    enqueueSnackbar("You must be logged in to access checkout page", {variant:"info"});
    history("/login");
  }


  // Fetch products and cart data on page load
  // Fetch addresses
  useEffect(() => {
    const onLoadHandler = async () => {
      const productsData = await getProducts();

      const cartData = await fetchCart(token);

      if (productsData && cartData) {
        const cartDetails = await generateCartItemsFrom(cartData, productsData);
        setItems(cartDetails);
      }
      const allAddresses = await getAddresses(token);
    };
    onLoadHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);




  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={12} md={9}>
          <Box className="shipping-container" minHeight="100vh">
            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Shipping
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Manage all the shipping addresses you want. This way you won't
              have to enter the shipping address manually with every order.
              Select the address you want to get your order delivered.
            </Typography>
            <Divider />
            <Box>
              {/* Display list of addresses and corresponding "Delete" buttons, if present, of which 1 can be selected */}
              
              {addresses.all.length ? (
                 addresses.all.map((addre) => (
                    <Box 
                    onClick={() => setAddresses({...addresses, selected: addre._id})}  
                    className={addresses.selected === addre._id ? "address-item selected" : "address-item not-selected"} 
                    value={addre._id} key={addre._id} 
                    >
                      <Typography >{addre.address}</Typography>
                      <Button onClick={() => deleteAddress(token,addre._id)} startIcon={<DeleteIcon />}>
                        Delete
                      </Button>
                    </Box>
                  ))
                ):(
                  <Typography my="1rem">
                    No addresses found for this account. Please add one to proceed
                  </Typography>
                )
              }
            </Box>

            {/* Dislay either "Add new address" button or the <AddNewAddressView> component to edit the currently selected address */}
            
            {
              newAddress.isAddingNewAddress ? (
                <AddNewAddressView
                token={token}
                newAddress={newAddress}
                handleNewAddress={setNewAddress}
                addAddress={addAddress}
                />
              ):(
                <Button
                color="primary"
                variant="contained"
                id="add-new-btn"
                size="large"
                onClick={() => {
                    setNewAddress((currNewAddress) => ({
                      ...currNewAddress,
                      isAddingNewAddress: true,
                    }));
                  }}
                >
                    Add new address
                </Button>
              )
            }
            

            <Typography color="#3C3C3C" variant="h4" my="1rem">
              Payment
            </Typography>
            <Typography color="#3C3C3C" my="1rem">
              Payment Method
            </Typography>
            <Divider />

            <Box my="1rem">
              <Typography>Wallet</Typography>
              <Typography>
                Pay ${getTotalCartValue(items)} of available $
                {localStorage.getItem("balance")}
              </Typography>
            </Box>

            <Button
              startIcon={<CreditCard />}
              variant="contained"
              onClick={() => performCheckout(token,items,addresses)}
            >
              PLACE ORDER
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={3} bgcolor="#E9F5E1">
          <Cart isReadOnly products={products} items={items} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default Checkout;
