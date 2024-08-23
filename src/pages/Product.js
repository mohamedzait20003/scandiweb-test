// Libraries
import React, {useEffect, useState} from 'react'
import { useLocation } from 'react-router-dom';
import parse from 'html-react-parser';

// Redux
import { useDispatch } from 'react-redux';
import { addItem, toogleCart } from '../context/slices/CartSlice';

const Product = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { Id, name, gallery, inStock, AttributeSets, price } = product;
  
  const [current, setCurrent] = useState(0);
  const handlePrevImage = () => {
    setCurrent((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : gallery.length - 1));
  };
  const handleNextImage = () => {
    setCurrent((prevIndex) => (prevIndex < gallery.length - 1 ? prevIndex + 1 : 0));
  };
  
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const handleChoseAttribute = (setId, itemId) => {
    setSelectedAttributes((prev) => ({...prev, [setId]: itemId}));
  };

  const [AllSelected, setAllSelected] = useState(false);
  useEffect(() => {
    if (AttributeSets) {
      setAllSelected(AttributeSets.every(set => selectedAttributes[set.Id]));
    }
    else{
      setAllSelected(true);
    }
  }, [selectedAttributes, AttributeSets]);

  const dispatch = useDispatch();
  const handleAdd = () => {
    dispatch(addItem(
      {
        id: Id,
        name: name,
        price: price,
        image: gallery[0].image_url,
        attributeSets: AttributeSets,
        attributes: selectedAttributes,
      }
    ));
    dispatch(toogleCart());
  }

  return (
    <div className='w-full h-[40rem] p-6'>
      <div className='container h-full flex flex-row'>
        <div className='w-4/6 h-full flex flex-row' data-testid='product-gallery'>
          { gallery.length > 1 ? (
              <div className="w-1/4 flex flex-col gap-5 max-h-[40rem] mr-2 overflow-hidden hover:overflow-y-auto">
                {gallery.map((image, index) => (
                  <img key={index} src={image.image_url} alt={`${name} ${index + 1}`} className="w-50 mb-2 cursor-pointer" onClick={() => setCurrent(index)} 
                  />
                ))}
            </div>
            )
            : null
          }
          <div className="relative max-h-[40rem] w-2/3 flex items-start">
            <button onClick={handlePrevImage} className={`${gallery.length > 1 ? 'absolute' : 'hidden'} left-5 top-1/2 transform -translate-y-1/2 p-2 bg-gray-600 text-white rounded`}>
              &lt;
            </button>
            <img src={gallery[current].image_url} alt={`${name} ${current + 1}`} className="h-full w-full py-0 px-6" />
            <button onClick={handleNextImage} className={`${gallery.length > 1 ? 'absolute' : 'hidden'} right-5 top-1/2 transform -translate-y-1/2 p-2 bg-gray-600 text-white rounded`}>
              &gt;
            </button>
          </div>
        </div>
        <div className='w-2/6 h-full flex flex-col gap-8 mt-5 ml-5'>
          <h2 className='text-3xl text-slate-800 font-bold'>{name}</h2>
          <div className='w-2/3 flex flex-col gap-8 '>
            {
              AttributeSets.map((attribute, index) => (
                <div key={index} className='flex flex-col gap-2' data-testid={`product-attribute-${attribute.name.toLowerCase()}`} >
                  <h3 className='text-xl text-slate-800 font-semibold'>{attribute.name}:</h3>
                  <div className='flex flex-row gap-5 mt-4'>
                    {
                      attribute.Items.map((item) => (
                        <button key={item.id} onClick={() => {handleChoseAttribute(attribute.Id, item.id)}}  className={`p-4 rounded-sm ${selectedAttributes[attribute.Id] === item.id ? (attribute.type === 'text' ? 'bg-black text-white' : 'border-2 border-green-500') : ''} ${attribute.type === 'swatch' ? 'swatch' : ''}`} style={attribute.type === 'swatch' ? { '--swatch-color': item.value } : {}} data-testid={`product-attribute-${attribute.name.toLowerCase()}-${item.value}`} >
                          {attribute.type === 'text' ? item.value : ''}
                        </button>
                      ))
                    }
                  </div>
                </div>
              ))
            }

          </div>
          <div className='flex flex-col gap-5'>
            <h3 className='text-3xl text-slate-800 font-semibold'>Price:</h3>
            <p className='text-xl text-slate-700 font-medium'> {price.currency_symbol}{price.amount}</p>
          </div>
            <button className={`bg-green-400 mr-10 mt-5 p-5 rounded-sm text-white ${inStock && AllSelected ? '' : 'opacity-50 cursor-not-allowed'}`} onClick={handleAdd} disabled={!inStock || !AllSelected} data-testid='add-to-cart' >
              Add To Cart
            </button>
          <div className='text-sm' data-testid='product-description' >
            {parse(product.description)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product