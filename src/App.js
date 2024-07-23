// Libraries
import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Components
import './App.css';
import Header from './components/Header';
import Category from './pages/Category';

function App() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const query = `
        {
          categories {
            name
            __typename
          }
        }
      `;

    try{
      const response = await axios.post('http://localhost:8000/graphql', {
        query: query,
      },{
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if(response.data.errors){
        console.log(response.data.errors);
      } else{
        console.log(response.data.data.categories);
        setCategories(response.data.data.categories);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Header categories={categories} />
      <main>
        <Routes>
          {categories.map((category) => (
            <Route key={category.id} path={`/${category.name}`} element={<Category category={category} />} />
          ))}
        </Routes>
      </main>
    </>
  );
}

export default App;
