// Libraries
import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request';

// Components
import ProductCard from '../components/ProductCard';

const Category = ({ category }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const endpoint = 'http://localhost:8000/graphql';
    const query = gql`
      query getProducts($category: String!) {
        products(category: $category) {
          id
          name
          inStock
          description
          brand
          galleries {
            id
            image_url
          }
          price {
            amount
            currency_label
          }
          attributeSets {
            name
            type
            items {
              displayValue
              value
            }
          }
        }
      }
    `;

    request(endpoint, query, { category: category.name })
    .then(
      data => {
        console.log(data);
        console.log(data.products);
        if (data && data.products) {
          setProducts(data.products);
        } else {
          console.error('Products data is undefined');
        }
      }
    )
    .catch(error => console.error(error));
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  return (
    <section className='w-full h-full'>
      <div className='flex flex-col py-10'>
        <h1 className='ml-10 text-3xl'>{category.name}</h1>
        <div className='w-full mt-20 px-8 grid grid-cols-3 items-center justify-items-center gap-8'>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Category