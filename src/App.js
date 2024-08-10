// Libraries
import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

// Styles
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

// pages
import MainCategory from './pages/MainCategory';
import Category from './pages/Category';
import Product from './pages/Product';

// Components
import Header from './components/Header';
import Cart from './components/Cart';

// Redux
import { Provider } from 'react-redux';
import store from './context/store';

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
    <>
      <ToastContainer />
      <Provider store={store}>
        <Header categories={categories} />
        <Cart />
        <Routes>
          <Route path="/" element={<MainCategory />} />
          {categories.map((category) => (
            <Route key={category.id} path={`/${category.name}`} element={<Category category={category} />} />
          ))}
          <Route path='product/:productId' element={<Product />} />
        </Routes>
      </Provider>
    </>
  );
}

export default App;