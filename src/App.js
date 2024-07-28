// App.js
import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import MainCategory from './pages/MainCategory';
import Category from './pages/Category';
import Product from './pages/Product';

import './App.css';
import Header from './components/Header';
import Cart from './components/Cart';

import store from './store/store';

function App() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const endpoint = 'http://localhost:8000/graphql';
    const query = gql`
      {
        categories {
          id
          name  
        }
      }
    `;
    
    request(endpoint, query)
    .then(
      data => {
        console.log(data);
        console.log(data.categories);
        if (data && data.categories) {
          setCategories(data.categories);
        } else {
          console.error('Categories data is undefined');
        }
      }
    )
    .catch(error => console.error(error));
  };
  

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Provider store={store}>
      <Header categories={categories} />
      <Cart />
      <Routes>
        <Route path="/" element={<MainCategory />} />
        {categories.map((category) => (
          <Route
            key={category.Id}
            path={`/${category.name}`} 
            element={<Category category={category} />}
          />
        ))}
        <Route path='product/:productId' element={<Product />} />
      </Routes>
    </Provider>
  );
}

export default App;