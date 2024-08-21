// Libraries
import React, { useState, useEffect, useCallback } from 'react';
import { request, gql } from 'graphql-request';

// Components
import ProductCard from '../components/ProductCard';

// Common
import SummaryApi from '../common/index';

const Category = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    const query = gql`${SummaryApi.AllProducts.Query}`;

    request(SummaryApi.AllProducts.URL, query)
    .then(data => {
      if (data && data.Products) {
        setProducts(data.Products);
      }
    })
    .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section className='w-full h-full'>
      <div className='flex flex-col py-10'>
        <h1 className='ml-10 text-3xl'>All</h1>
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