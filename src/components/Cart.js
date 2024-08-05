// Libraries
import React, { useState, useEffect } from 'react'
import { request, gql } from 'graphql-request';

// Components
import CartItem from './CartItem'

// Redux
import { useSelector } from 'react-redux'

const Cart = () => {
    const { isCartOpen, cartItems, totalCount, totalMoney } = useSelector((state) => state.cart);

    const [AllSelected, setAllSelected] = useState(false);
    const allAttributesChosen = () => {
        return cartItems.every(item => {
            return item.attributeSets.every(set => {
                return item.attributes.hasOwnProperty(set.Id);
            });
        });
    };
    useEffect(() => {
        setAllSelected(allAttributesChosen());
    }, [cartItems]);


    const handleOrder = () => {
    };

    return (
        <>
            {isCartOpen && (
                <>
                    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 z-10'></div>
                    <div className='fixed top-18 right-5 w-96 min-h-24 max-h-svh bg-white shadow-sm p-4 z-50'>
                        <div className='flex flex-col'>
                            <div className='flex flex-row py-3 text-slate-800'>
                                <h2 className='font-bold mr-3'>My Bag:</h2>
                                <p className='font-semibold'>{totalCount} items</p>
                            </div>
                            <div className='flex flex-col space-y-2 max-h-60 overflow-y-auto'>
                                {
                                    cartItems.map((item, index) => (
                                        <CartItem key={index} item={item} />
                                    ))
                                }
                            </div>
                            <div className='w-full flex flex-col gap-3 py-3'>
                                <div className='w-full flex flex-row items-center justify-between text-slate-800 font-semibold'>
                                    <h3>Total:</h3>
                                    <p>${Math.abs(totalMoney).toFixed(2)}</p>
                                </div>
                                <button className={`w-full bg-green-500 px-5 py-2 text-white ${AllSelected ? '' : 'opacity-50 cursor-not-allowed'}`} onClick={handleOrder}>Place Order</button>
                            </div>

                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Cart