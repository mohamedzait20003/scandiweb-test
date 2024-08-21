import React, { useState, useEffect, Fragment } from 'react'
import { Outlet } from 'react-router-dom';
import { request, gql } from 'graphql-request';
import { ToastContainer } from 'react-toastify';

// Styles
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from '../components/Header';
import Cart from '../components/Cart';

const Home = () => {
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
            <Header categories={categories} />
            <Cart />
            <Fragment>
                <Outlet />
            </Fragment>
        </>
    )
}

export default Home