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
    <div className='mt-12'>
      <p className='text-2xl md:text-3xl font-medium'>Categories</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 mt-6 gap-6'>
        {categories.map((category) => (
          // inside categories.map...
          <div
            key={category.id}
            onClick={() => navigate(`/products?category=${category.path}`)}
            className='group cursor-pointer py-5 px-3 gap-2 rounded-lg flex flex-col justify-center items-center h-full transition-shadow hover:shadow-md'
            style={{ background: category.bg_color }}
          >
            {/* Added aspect-square and fixed width/height */}
            <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center overflow-hidden">
              <img
                src={category.cloudinary_url || category.image_url}
                alt={category.name}
                className='group-hover:scale-110 transition duration-300 w-full h-full object-contain'
              />
            </div>
            <p className='text-xl font-medium mt-1'>{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Category
