import axios from 'axios';
import { useEffect, useState } from 'react';
import MenuCard from './MenuCard';

const MenuCardWrapper = ({ category, items, updateCount }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const itemsRes = await axios.get(`${baseUrl}/api/items`, {
          params: category !== "" ? { category } : {}
        });
        setProducts(itemsRes.data);
      } catch (error) {
        console.error('Failed to get items', error);
      }
    }
    fetchItems();
  }, [category]);

  return (
    <>
      {products.map(product => {
        const existing = items.find(cartItem => cartItem.productId === product._id);
        return (
          <MenuCard
            key={product._id}
            _id={product._id}
            name={product.name}
            image={product.image}
            price={product.price}
            description={product.description}
            count={existing ? existing.count : 0}
            updateCount={(id, name, newCount) =>
              updateCount(product, newCount)
            }
          />
        );
      })}
    </>
  )
}

export default MenuCardWrapper
