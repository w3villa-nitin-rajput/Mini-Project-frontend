import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { productService } from "../api/api";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import { CiShoppingCart } from "react-icons/ci";
import { IoArrowBack } from "react-icons/io5";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currency, cartItems, addToCart, updateQuantity } = useAppContext();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await productService.getOne(id);
        setProduct(res.data);
      } catch (err) {
        setError("Product not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-2xl font-semibold text-gray-700">😕 {error || "Product not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary border border-primary px-5 py-2 rounded-full hover:bg-primary hover:text-white transition-colors duration-200"
        >
          <IoArrowBack /> Go Back
        </button>
      </div>
    );
  }

  const images = product.cloudinary_url ? [product.cloudinary_url, ...(product.image_urls || [])] : (product.image_urls || []);
  const quantity = cartItems[product.id] || 0;
  const displayPrice = product.discounted_price || product.offer_price || product.price;

  return (
    <div className="py-10 max-w-6xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors duration-200 mb-8 text-sm font-medium"
      >
        <IoArrowBack className="text-lg" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* ---- Left: Image Gallery ---- */}
        <div className="flex flex-col gap-4">
          {/* Main Image */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center h-80 md:h-96">
            <img
              className="max-h-full max-w-full object-contain transition-opacity duration-300"
              src={images[selectedImage] || ""}
              alt={product.name}
            />
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 w-16 h-16 border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                    selectedImage === i
                      ? "border-primary shadow-md"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={url}
                    alt={`${product.name} ${i + 1}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---- Right: Product Info ---- */}
        <div className="flex flex-col gap-5">
          {/* Category Badge */}
          <span className="inline-block self-start bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="text-3xl font-bold text-gray-800 leading-tight">{product.name}</h1>

          {/* Star Rating */}
          <div className="flex items-center gap-1">
            {Array(5)
              .fill("")
              .map((_, i) => (
                <img
                  key={i}
                  className="w-4"
                  src={i < 4 ? assets.star_icon : assets.star_dull_icon}
                  alt="star"
                />
              ))}
            <span className="text-gray-400 text-sm ml-2">(4.0)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-end gap-3">
            <p className="text-4xl font-bold text-primary">
              {currency}{displayPrice}
            </p>
            {product.price && displayPrice !== product.price && (
              <p className="text-xl text-gray-400 line-through font-normal mb-0.5">
                {currency}{product.price}
              </p>
            )}
            {product.price && displayPrice !== product.price && (
              <span className="text-green-500 text-sm font-semibold mb-0.5">
                {Math.round(((product.price - displayPrice) / product.price) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {product.in_stock ? (
              <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-red-500 text-sm font-medium">
                <span className="w-2 h-2 bg-red-500 rounded-full inline-block" />
                Out of Stock
              </span>
            )}
          </div>

          {/* Divider */}
          <hr className="border-gray-200" />

          {/* Description */}
          {product.description && product.description.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">
                About this product
              </h2>
              <ul className="space-y-1.5 text-gray-600 text-sm">
                {(Array.isArray(product.description)
                  ? product.description
                  : [product.description]
                ).map((line, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Add to Cart */}
          <div className="mt-2">
            {quantity === 0 ? (
              <button
                disabled={!product.in_stock}
                onClick={() => addToCart(product.id)}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold text-white transition-all duration-200 ${
                  product.in_stock
                    ? "bg-primary hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <CiShoppingCart className="text-2xl" />
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 select-none">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="w-7 h-7 flex items-center justify-center text-primary font-bold text-lg hover:bg-primary/20 rounded-full transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-semibold text-gray-800 text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="w-7 h-7 flex items-center justify-center text-primary font-bold text-lg hover:bg-primary/20 rounded-full transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">{quantity} in cart</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
