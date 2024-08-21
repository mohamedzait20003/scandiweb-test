// Libraries
import React from 'react';
import { RouterProvider } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import store from './context/store';

// Styles
import './App.css';

// router
import router from './routes';


function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  );
}

export default App;