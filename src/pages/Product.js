// Libraries
import React from 'react'
import { useLocation } from 'react-router-dom';

const Product = () => {
  const location = useLocation();
  const { product } = location.state || {};

  if (!product) {
    return <div>No product data available</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>{product.price.currency_label === 'USD' ? '$' : product.price.currency_label}{product.price.amount}</p>
      <p>{product.description}</p>
    </div>
  )
}

export default Product