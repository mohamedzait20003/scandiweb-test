// Libraries
import React, { useState, useEffect } from 'react';

// Components
import './App.css';
import Header from './components/Header';
import Category from './components/Category';

function App() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            query {
              categories {
                id
                name
                __typename
              }
            }
          `,
        }),
      });

      const text = await response.text();
      console.log('Raw response:', text); // Debugging line

      let result;
      try {
        result = JSON.parse(text);
      } catch (parseError) {
        console.log('Failed to parse JSON response:', text); // Enhanced logging
        throw new Error('Failed to parse JSON response');
      }
      console.log('Parsed result:', result); // Debugging line

      if (result.errors) {
        console.log(result.errors[0].message);
      } else if (result.data && result.data.categories) {
        setCategories(result.data.categories);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.log(err.message);
    } 
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Header categories={categories} />
      <main>
        
      </main>
    </>
  );
}

export default App;
