import React, { useEffect, useState } from 'react';
import { clientAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await clientAPI.getProducts();
        setProducts(response.data.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">Shop for Credits</h1>
      {products.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No products available at the moment. Please check back later!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center text-center">
              {product.images && product.images.length > 0 && (
                <img src={product.images[0]} alt={product.name} className="w-32 h-32 object-cover rounded-full mb-4"/>
              )}
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex flex-col items-center">
                {product.prices.map((price) => (
                  <div key={price.stripePriceId} className="mb-2">
                    <p className="text-xl font-bold text-green-600">
                      ${(price.unitAmount / 100).toFixed(2)} {price.currency.toUpperCase()}
                      {price.recurring && ` / ${price.recurring.interval}`}
                    </p>
                    <button
                      onClick={() => alert(`Purchasing ${product.name} for $${(price.unitAmount / 100).toFixed(2)}`)}
                      className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300"
                    >
                      Buy Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Shop;
