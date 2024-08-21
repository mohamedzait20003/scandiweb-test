// Library
import { createBrowserRouter } from 'react-router-dom';

// Pages
import Home from '../pages/Home';
import MainCategory from '../pages/MainCategory';
import Category from '../pages/Category';
import Product from '../pages/Product';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
        children: [
            {
                path: '/',
                element: <MainCategory />,
            },
            {
                path: ':category',
                element: <Category />,
            },
            {
                path: 'product/:id',
                element: <Product />,
            }
        ]
    }
]);

export default router;