// Libraries
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Redux
import { toogleCart } from '../context/slices/CartSlice';

// Images
import Logo from '../assets/Logo/Logo.png';

const Header = ({ categories }) => {
  const [state, setState] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const location = useLocation();
  
  const { totalCount } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const handleOpenCart = useCallback((state) => {
    dispatch(toogleCart(state));
  }, [dispatch]);

  useEffect(() => {
    if (isCartOpen !== false) {
      handleOpenCart(isCartOpen);
    }
  }, [isCartOpen, handleOpenCart]);

  useEffect(() => {
    if (location.pathname === `/`) {
      setState(0);
    } else {
      const categoryIndex = categories.findIndex(category => `/${category.name}` === location.pathname);
      if (categoryIndex !== -1) {
        setState(categoryIndex + 1);
      }
    }
  }, [location.pathname, categories]);

  return (
    <header className='h-16 sticky bg-white shadow-sm z-30'>
      <div className='h-full relative mx-auto px-6 flex flex-row items-center justify-between'>
        <ul className='flex items-center list-none gap-12  ml-4'>
          <li className={`p-4 ${state === 0 ? 'w-full border-b-2 border-green-400' : 'border-none'}`}>
              <Link to={"/"} className={`text-lg font-semibold ${state === 0 ? 'text-green-400' : 'text-gray-900'}`} data-testid={state === 0 ? 'active-category-link' : 'category-link'} >
                All
              </Link>
          </li>
          {categories.map((category, index) => (
            <li key={index} className={`p-4 ${state === index+1 ? 'w-full border-b-2 border-green-400' : 'border-none'}`} >
              <Link to={`/${category.name}`} className={`text-lg font-semibold ${state === index+1 ? 'text-green-400' : 'text-gray-900'}`} data-testid={state === index+1 ? 'active-category-link' : 'category-link'} >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className='absolute left-1/2 transform -translate-x-1/2 '>
            <Link to={"/"} className='flex items-center justify-center'>
                <img className='w-16 h-10' src={Logo} alt="ZCommerce Logo" />
            </Link>
        </div>
        <div className='flex items-center gap-5 mr-8'>
          <div className='relative'>
            <button data-testid='cart-btn' className='h-10 min-w-[50px] bg-transparent flex items-center justify-center rounded-full text-2xl text-blue-950' onClick={() => setIsCartOpen(!isCartOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </button>
            {
              totalCount > 0 && (
                <p className=' w-5 h-5 -top-1 -right-0 absolute flex items-center justify-center bg-black text-white rounded-full p-1'>{totalCount}</p>
              )
            }
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;