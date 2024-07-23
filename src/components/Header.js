// Libraries
import React from 'react'
import { Link } from 'react-router-dom'

// Images
import Logo from '../assets/Logo/Logo.png'
import Cart from '../assets/Shop Cart/Cart.svg'

const Header = ({ categories }) => {
  return (
    <header className='h-16 bg-white shadow-sm'>
      <div className='h-full container mx-auto flex items-center justify-between px-4'>
        <div className=''>
          {categories.map((category) => (
            <Link key={category.id} to={`/${category.name}`} className='text-lg text-gray-900 font-semibold'>{category.name}</Link>
          ))}
        </div>
        <div className=''>
            <Link to={"/"} className='flex flex-row items-center justify-start space-x-2'>
                <img className='w-16 h-10' src={Logo} alt="ZCommerce Logo" />
            </Link>
        </div>
        <div className='flex items-center gap-5 md:-mr-10'>
          <div className='relative'>
            <button className='h-10 min-w-[50px] bg-transparent flex items-center justify-center rounded-full text-2xl text-blue-950'>
              <img src={Cart} alt="Cart" className='h-8 w-8' />
            </button>
            <p className=' w-5 h-5 -top-1 -right-0 absolute flex items-center justify-center bg-black text-white rounded-full p-1'>0</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header