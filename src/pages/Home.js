import React, { useState, useEffect, useCallback, Fragment } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { request, gql } from 'graphql-request';
import { ToastContainer } from 'react-toastify';

// Styles
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from '../components/Header';
import Cart from '../components/Cart';

// Common
import SummaryApi from '../common/index';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchCategories = useCallback(async () => {
        const query = gql`${SummaryApi.Categories.Query}`;
        
        request(SummaryApi.Categories.URL, query)
        .then(
          data => {
            if (data && data.categories) {
              setCategories(data.categories);
            }
          }
        )
        .catch(error => console.error(error));
    }, []);
    
    const StartDirect = useCallback(() => {
      if (location.pathname === '/') {
        navigate('/all');
      }
    }, [location.pathname, navigate]);
    
    useEffect(() => {
      fetchCategories();
      StartDirect();
    }, [fetchCategories, StartDirect]);
    
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