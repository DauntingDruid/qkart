import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack, Grid } from "@mui/material";
import { Box} from "@mui/system";
import React from "react";
import { useNavigate } from 'react-router-dom';
import "./Cart.css";

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
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */
export const generateCartItemsFrom = (cartData, productsData) => {
  
  console.log("cartData",cartData);
  // console.log("all products",productsData);  
  
  const productsInCart = [];
    cartData?.map((item) =>{
        productsData.map((product) =>{
            if(product._id === item.productId){
              
              const data = {
                ...item,
                name: product.name,
                category: product.category,
                cost: product.cost,
                rating: product.rating,
                image: product.image,
                _id: product._id,
              };
              productsInCart.push(data);
            }
          }
        )
      }
    )
 return productsInCart;
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let totalCost = 0;
  
  items.map((prod) => { 
    totalCost += prod.cost*prod.qty;
  })
  console.log(totalCost);
  return totalCost;
};


// Implement function to return total cart quantity
export const getTotalItems = (items = []) => {
  let totalQty = 0;
  
  items.map((prod) => { 
    totalQty += prod.qty;
  })
  console.log(totalQty);
  return totalQty;
};

// * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
}) => {

  {
    if(!handleAdd){
      return (
        <Box padding="0.5rem" data-testid="item-qty">
          Qty: {value}
        </Box>
      );
    }else {
      return (
        <Stack direction="row" alignItems="center">
          <IconButton size="small" color="primary" onClick={handleDelete}>
            <RemoveOutlined />
          </IconButton>
          <Box padding="0.5rem" data-testid="item-qty">
            {value}
          </Box>
          <IconButton size="small" color="primary" onClick={handleAdd}>
            <AddOutlined />
          </IconButton>
        </Stack>
      );
    }
  }

  
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
  isReadOnly = false,
}) => {
  console.log("ROUTING TO CART")
  //route to checkout
  const history = useNavigate();
  const routeToCheckout = () => {
    history("/checkout");
  };
  //get total quantity of items
  const quantity = getTotalItems(items);
  console.log(quantity);
  //total cost of items
  const totalCost = getTotalCartValue(items);

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
    
      <Box className="cart">
        {/*Display view for each cart item with non-zero quantity */}
      
      {
        items.map((product) => (
          <Box key={product._id} sx={{
            margin: 1,
          }} className="cart-item-box" display="flex" alignItems="flex-start" padding="1rem">
            <Box className="image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    width="100%"
                    height="100%"
                />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between" height="6rem" paddingX="1rem">
                <div>{product.name}</div>
              <Box display="flex" justifyContent="space-between" alignItems="center">
              {  
                !isReadOnly ?
                  (<ItemQuantity 
                  value={product.qty} 
                  handleAdd={() => handleQuantity(product.productId, product.qty + 1)} 
                  handleDelete={() => handleQuantity(product.productId, product.qty - 1)}
                  />): (<ItemQuantity 
                    value={product.qty}
                    />)
              }
                <Box padding="0.5rem" fontWeight="700">
                    ${product.cost}
                </Box>
                </Box>
            </Box>
          </Box>
        ))
      }

      {
        !isReadOnly ? (
        <>
          <Box padding="1rem" display="flex" justifyContent="space-between" alignItems="center">
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${totalCost}
            </Box>
          </Box>
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              onClick={routeToCheckout}
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
            >
              Checkout
            </Button>
          </Box>
        </>
        ):(
        <>
          <Box container backgroundColor="white">
            <Box padding="1rem" fontSize="2rem" fontWeight="800">Order Details</Box>
            <Box padding="1rem" display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                products
              </Box>
              <Box>
                {quantity}
              </Box>
            </Box>
            <Box padding="1rem" display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                Sub Total
              </Box>
              <Box>
                ${totalCost}
              </Box>
            </Box>
            <Box padding="1rem" display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                Shipping Charges
              </Box>
              <Box>
                $0
              </Box>
            </Box>
            <Box padding="1rem" fontSize="1.5rem" fontWeight="700" display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                Total
              </Box>
              <Box>
                ${totalCost}
              </Box>
            </Box>
          </Box>
        </>
        )
      } 

        

      </Box>
    </>
  );
};

export default Cart;
