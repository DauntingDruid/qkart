import { AddShoppingCartOutlined } from "@mui/icons-material";
//import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";



const ProductCard = ({ product, handleAddToCart }) => {

  

  return (
    
        <Card id={product._id} sx={{ maxWidth: 345, height: 'full'}} className="card">
          {/* add category */}
          <CardActionArea>
            <CardMedia
              id={product.category}
              component="img"
              image={product.image}
              alt={product.name}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product.name}
              </Typography>
              <Typography gutterBottom variant="h5" style={{ fontWeight: 600 }} component="div">
                ${product.cost}
              </Typography>
              <Rating name="half-rating-read" defaultValue={product.rating} precision={0.5} readOnly />
            </CardContent>
          </CardActionArea>
          
          <Button variant="contained" fullWidth onClick={() => handleAddToCart(product._id)}>          
            <AddShoppingCartOutlined />ADD TO CART        
          ​</Button>
        </Card>
    
  );
};

export default ProductCard;
