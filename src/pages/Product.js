// Libraries
import React, {useState} from 'react'
import { useLocation } from 'react-router-dom';
import parse from 'html-react-parser';

const Product = () => {
  const location = useLocation();
  const { product } = location.state || {};
  const { name, gallery, inStock, price } = product;
  console.log(gallery);

  const [current, setCurrent] = useState(0);

  const handlePrevImage = () => {
    setCurrent((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : gallery.length - 1));
  };

  const handleNextImage = () => {
    setCurrent((prevIndex) => (prevIndex < gallery.length - 1 ? prevIndex + 1 : 0));
  };

  return (
    <div className='w-full h-[40rem] p-6'>
      <div className='container h-full flex flex-row'>
        <div className='w-4/6 h-full flex flex-row'>
          <div className="w-1/4 flex flex-col gap-5 max-h-[40rem] mr-2 overflow-hidden hover:overflow-y-auto">
            {gallery.map((image, index) => (
              <img 
                key={index} 
                src={image.image_url} 
                alt={`${name} ${index + 1}`} 
                className="w-50 mb-2 cursor-pointer" 
                onClick={() => setCurrent(index)} 
              />
            ))}
          </div>
          <div className="relative max-h-[40rem] w-2/3 flex items-start">
            <button onClick={handlePrevImage} className="absolute left-5 top-1/2 transform -translate-y-1/2 p-2 bg-gray-600 rounded">
              &lt;
            </button>
            <img src={gallery[current].image_url} alt={`${name} ${current + 1}`} className="h-full w-full" />
            <button onClick={handleNextImage} className="absolute right-5 top-1/2 transform -translate-y-1/2 p-2 bg-gray-600 rounded">
              &gt;
            </button>
          </div>
        </div>
        <div className='w-2/6 h-full flex flex-col gap-12 mt-10 ml-5'>
          <h1 className='text-2xl text-slate-800 font-semibold'>{name}</h1>
          <div className='flex flex-col gap-5 text-xl text-slate-700 font-medium'>
            <h2>Price:</h2>
            <p>{price.currency_symbol}{price.amount}</p>
          </div>
          <button className={`bg-green-400 mr-10 p-5 rounded-sm text-white ${inStock ? '' : ''}`}>Add To Cart</button>
          <div>
            {parse(product.description)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product