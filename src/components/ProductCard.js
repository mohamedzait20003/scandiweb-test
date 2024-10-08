// Libraries
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { kebabCase } from 'lodash';

// redux
import { useDispatch } from 'react-redux';
import { addItem, openCart } from '../context/slices/CartSlice';

const ProductCard = ({ product }) => {
  const { Id, name, gallery, inStock, AttributeSets, price } = product;

  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/product/${Id}`, { state: { product } });
  };

  const dispatch = useDispatch();
  const handleAdd = (e) => {
    e.stopPropagation();
    const initialAttributes = {};
    AttributeSets.forEach(attribute => {
      if (attribute.Items.length > 0) {
        initialAttributes[attribute.Id] = attribute.Items[0].id;
      }
    });

    dispatch(addItem({
      id: Id,
      name: name,
      price: price,
      image: gallery[0].image_url,
      attributeSets: AttributeSets,
      attributes: initialAttributes,
    }));
    dispatch(openCart());
  };

  return (
    <div className={`w-full relative container p-4 hover:shadow-xl group cursor-pointer`} onClick={handleClick} data-testid={`product-${kebabCase(name.toLowerCase())}`} >
      <div className='w-full flex flex-col items-center justify-center p-10'>
        <div className='relative p-6 mt-0 mb-5'>
          <img src={gallery[0].image_url} alt={name} className={`w-full h-60 z-10 ${!inStock ? 'grayscale cursor-not-allowed' : 'cursor-pointer'}`} />
          {!inStock && (
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white'>
              Out of Stock
            </div>
          )}
        </div>
        <div className='w-full flex flex-row items-center justify-between'>
          <div className='flex flex-col'>
            <p>{name}</p>
            <p>
              {price.currency_symbol}{price.amount}
            </p>
          </div>
          {inStock && (
            <div className='relative flex justify-end items-center -top-10 w-10 h-10 opacity-0 group-hover:opacity-100'>
              <button className='relative w-10 h-10 bg-green-400 flex justify-center items-center outline-none border-none rounded-full z-50' onClick={handleAdd}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;