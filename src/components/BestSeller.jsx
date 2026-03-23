import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
  const {products} = useAppContext()

  
  return (
    <div className=' mt-12 mx-auto'>
      <p className=' text-2xl md:text-3xl font-medium'>Best Seller</p>
      <div>
        <ProductCard products={products} />
      </div>
    </div>
  )
}

export default BestSeller
