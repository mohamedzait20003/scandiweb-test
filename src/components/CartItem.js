// Libraries
import React, { useState } from 'react'
import { kebabCase } from 'lodash';

// Redux
import { useDispatch } from 'react-redux'
import { incrementItem, decrementItem, AttributeChange } from '../context/slices/CartSlice'

const CartItem = ({ item }) => {
    const Attributes = item.attributes;

    const dispatch = useDispatch();
    const handleIncrement = () => {
        dispatch(incrementItem({ id: item.id, attributes: item.attributes }));
    };
    const handleDecrement = () => {
        dispatch(decrementItem({ id: item.id, attributes: item.attributes }));
    };

    const [selectedAttributes, setSelectedAttributes] = useState(Attributes);
    const handleAttributeChange = (setId, itemId) => {
        const updatedAttributes = { ...selectedAttributes, [setId]: itemId };
        setSelectedAttributes(updatedAttributes);
        dispatch(AttributeChange({id: item.id, attributes: item.attributes, changedAttributes: updatedAttributes}));
    }

    return (
        <div className='h-full grid grid-cols-6 py-5 justify-between'>
            <div className='flex flex-col col-span-3'>
                <h2 className='text-slate-700 font-mono font-semibold'>{item.name}</h2>
                <p>{item.price.currency_symbol}{item.price.amount}</p>
                <div className='flex flex-col mt-5 gap-5'>
                    {
                        item.attributeSets.map((set, index) => (
                            <div key={index} className='flex flex-col'  data-testid={`cart-item-attribute-${kebabCase(set.name.toLowerCase())}`} >
                                <h3 className='text-slate-700 font-mono font-medium'>{set.name}</h3>
                                <div className='flex flex-row gap-2 mt-2'>
                                    {
                                        set.Items.map((item) => (
                                            <button key={item.id} onClick={() => {handleAttributeChange(set.Id, item.id)}}  className={`rounded-sm ${Attributes[set.Id] === item.id ? (set.type === 'text' ? 'bg-black text-white' : 'border-2 border-green-500') : ''} ${set.type === 'swatch' ? 'p-3 swatch' : 'px-2 py-1'}`} style={set.type === 'swatch' ? { '--swatch-color': item.value } : {}}  data-testid={`cart-item-attribute-${kebabCase(set.name.toLowerCase())}-${item.value}${Attributes[set.Id] === item.id ? '-selected' : ''}`} >
                                                {console.log(`cart-item-attribute-${kebabCase(set.name.toLowerCase())}-${item.value}${Attributes[set.Id] === item.id ? '-selected' : ''}`)}
                                                {set.type === 'text' ? item.value : ''}
                                            </button>
                                        ))
                                    }
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='min-h-28 flex flex-col items-center justify-between col-span-1'>
                <button className='px-2 py-1 text-black border-2 border-green-500 rounded-sm' onClick={handleIncrement} data-testid='cart-item-amount-increase'>
                    &#43;
                </button>
                <p className='' data-testid='cart-item-amount'>{item.quantity}</p>
                <button className='px-2 py-1 text-black border-2 border-green-500 rounded-sm' onClick={handleDecrement} data-testid='cart-item-amount-decrease'>
                    &#8722;
                </button>
            </div>
            <div className='w-20 min-h-28 col-span-2 flex items-center'>
                <img className='object-center h-fit' src={item.image} alt='' />
            </div>
        </div>
    )
}

export default CartItem