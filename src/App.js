// Libraries
import React, { useState, useEffect } from 'react';
import { request, gql } from 'graphql-request';
import { Routes, Route } from 'react-router-dom';

// Components
import './App.css';
import Header from './components/Header';
import Category from './pages/Category';

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
    <>
      <Header categories={categories} />
      <Routes>
        <Route path="/" element={<Category category={{ id: 3, name: 'All' }} />} />
        {categories.map((category) => (
          <Route
            key={category.id}
            path={`/${category.name}`}
            element={<Category category={category} />}
          />
        ))}
      </Routes>
    </>
  );
}

export default App;
