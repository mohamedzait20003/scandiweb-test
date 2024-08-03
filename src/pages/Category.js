// Libraries
import React, { useState, useEffect, useCallback } from 'react';
import { request, gql } from 'graphql-request';

// Components
import ProductCard from '../components/ProductCard';

const Category = ({ category }) => {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    const endpoint = 'http://localhost:8000/graphql';
    const query = gql`
      query getProducts($category_id: Int!) {
        Products(category_id: $category_id) {
          Id
          name
          inStock
          description
          brand
          gallery {
            id
            image_url
          }
          price {
            id
            amount
            currency_label
            currency_symbol
          }
          AttributeSets {
            Id
            name
            type
            Items {
              id
              name
              value
            }
          }
        }
      }
    `;

    try {
      const variables = { category_id: parseInt(category.id, 10) };
      const data = await request(endpoint, query, variables);
      if (data && data.Products) {
        setProducts(data.Products);
      } else {
        console.error('Products data is undefined');
      }
    } catch (error) {
      console.error(error);
    }
  }, [category.id]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section className='w-full h-full'>
      <div className='flex flex-col py-10'>
        <h1 className='ml-10 text-3xl'>{category.name}</h1>
        <div className='w-full mt-20 px-8 grid grid-cols-3 items-center justify-items-center gap-8'>
          {products.map((product) => (
            <ProductCard key={product.Id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Category;