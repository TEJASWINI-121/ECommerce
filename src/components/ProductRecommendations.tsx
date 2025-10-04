import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';
import { RootState, AppDispatch } from '../store/store';
import { getRelatedProducts } from '../store/slices/productSlice';
import { addToSimpleCart } from '../utils/simpleCart';

interface ProductRecommendationsProps {
  productId: string;
  category: string;
}

const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({ productId, category }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { relatedProducts } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    if (productId && category) {
      dispatch(getRelatedProducts({ productId, category }));
    }
  }, [dispatch, productId, category]);

  const handleQuickAddToCart = (product: any) => {
    addToSimpleCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <Link to={`/product/${product._id}`}>
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>
            <div className="p-4">
              <Link to={`/product/${product._id}`}>
                <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                  {product.name.length > 40 ? `${product.name.substring(0, 40)}...` : product.name}
                </h3>
              </Link>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-1">({product.numReviews})</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleQuickAddToCart(product)}
                  className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                  aria-label="Add to cart"
                >
                  <ShoppingCart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductRecommendations;