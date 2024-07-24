const ProductCard = ({ product }) => {
  const isOutOfStock = product.inStock !== 1;

  return (
    <div className={`w-full relative container p-4 hover:shadow-xl group ${isOutOfStock ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className='w-full flex flex-col justify-center'>
        <div className='relative'>
          <img src={product.image} alt={product.name} className={`${isOutOfStock ? 'grayscale' : ''}`} />
          {isOutOfStock && (
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white'>
              Out of Stock
            </div>
          )}
        </div>
        <div className='w-full flex flex-row items-center justify-between'>
          <div className='flex flex-col'>
            <p>{product.name}</p>
            <p>
              {product.price.currency_label === 'USD' ? '$' : product.price.currency_label}{product.price.amount}
            </p>
          </div>
          {!isOutOfStock && (
            <div className='flex justify-end items-center w-10 h-10 opacity-0 group-hover:opacity-100'>
              <button className='w-10 h-10 outline-none border-none bg-green-400 rounded-full flex justify-center items-center'>
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