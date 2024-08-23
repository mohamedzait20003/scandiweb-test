// Libraries
import React, { useState, useEffect, useCallback } from 'react'
import { request, gql } from 'graphql-request';
import { toast } from 'react-toastify';

// Components
import CartItem from './CartItem'

// Redux
import { useSelector, useDispatch } from 'react-redux'
import { emptyCart, closeCart } from '../context/slices/CartSlice'

// Common
import SummaryApi from '../common/index'

const Cart = () => {
    const dispatch = useDispatch();
    const { isCartOpen, cartItems, totalCount, totalMoney } = useSelector((state) => state.cart);

    const [AllSelected, setAllSelected] = useState(false);
    const allAttributesChosen = useCallback(() => {
        return cartItems.every(item => {
            return item.attributeSets.every(set => {
                return item.attributes.hasOwnProperty(set.Id);
            });
        });
    }, [cartItems]);
    useEffect(() => {
        setAllSelected(allAttributesChosen());
    }, [cartItems, allAttributesChosen]);

    const handleCloseCart = () => {
        dispatch(closeCart());
    }

    const handleOrder = async () => {
        const mutation = gql`${SummaryApi.OrderMake.Mutation}`;

        const order = {
            total_quantity: totalCount,
            total_price: totalMoney,
            date: new Date().toISOString().split('T')[0],
            items: cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price.amount,
                attributes: Object.entries(item.attributes).map(([setId, choiceId]) => ({
                    set_id: parseInt(setId),
                    choice_id: parseInt(choiceId)
                }))
            }))
        };

        request(SummaryApi.OrderMake.URL, mutation, { order })
        .then(response => {
            if (response.createOrder.status === 'success') {
                dispatch(emptyCart());
                toast.success('Order placed successfully!');
                dispatch(closeCart(false));
            }
        })
        .catch(error => console.error('Error placing order:', error));
    };

    return (
        <>
            {isCartOpen && (
                <>
                    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 z-10' onClick={handleCloseCart}></div>
                    <div data-testid="cart-overlay" className='fixed top-18 right-5 w-96 min-h-24 max-h-svh bg-white shadow-sm p-4 z-50'>
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
                                <div className='w-full flex flex-row items-center justify-between text-slate-800 font-semibold' data-testid='cart-total'>
                                    <h3>Total:</h3>
                                    <p>${Math.abs(totalMoney).toFixed(2)}</p>
                                </div>
                                <button className={`w-full bg-green-500 px-5 py-2 text-white ${AllSelected && cartItems.length > 0 ? '' : 'opacity-50 cursor-not-allowed'}`} disabled={!AllSelected || cartItems.length === 0} onClick={handleOrder}>Place Order</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Cart