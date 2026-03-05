import { useAppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

const Category = () => {
  const { categories, dataLoading } = useAppContext()
  const navigate = useNavigate()

  if (dataLoading) {
    return (
      <div className='mt-16'>
        <p className='text-2xl md:text-3xl font-medium'>Categories</p>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>
          {Array(7).fill('').map((_, i) => (
            <div key={i} className='py-5 px-3 rounded-lg bg-gray-100 animate-pulse h-40' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='mt-16'>
      <p className='text-2xl md:text-3xl font-medium'>Categories</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => navigate(`/products?category=${category.path}`)}
            className='group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center h-full'
            style={{ background: category.bg_color }}
          >
            <img
              src={category.image_url}
              alt={category.name}
              className='group-hover:scale-105 transition max-w-28'
            />
            <p className='text-sm font-medium'>{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Category
