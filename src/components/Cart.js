// Libraries
import React, { useEffect } from 'react'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { toogleCart } from '../store/slices/CartSlice'

const Cart = () => {
    const dispatch = useDispatch();

    const { isCartOpen } = useSelector((state) => state.cart);
    const { cartItems } = useSelector((state) => state.cart);
    const cartQuantity = cartItems.length; 

    useEffect(() => {
        const docBody = document.body;

        isCartOpen ? docBody.classList.add('overflow-hidden') : docBody.classList.remove('overflow-hidden');
    }, [isCartOpen]);

    return (
        <>
            {isCartOpen && (
                <>
                    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 z-10'></div>
                    <div className='fixed top-18 right-5 w-72 min-h-24 max-h-96 bg-white shadow-sm p-4 z-50 overflow-y-auto'>
                        <div className=''>
                            <div className='flex'>
                                <h2 className='flex flex-row text-slate-800'><span className='font-boldv mr-3'>My Bag:</span>{cartQuantity} items</h2>
                            </div>

                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Cart