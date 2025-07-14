import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import MenuCard from './MenuCard';

const MenuCardWrapper = (props) => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [products, setProducts] = useState([]);

    useEffect(() =>{
        const fetchItems = async () => {
            try {
                const items = await axios.get(`${baseUrl}/api/items`, {
                    params: props.category !== "" ? { category: props.category } : {}
                });
                setProducts(items.data);
            } catch (error) {
                console.error('Failed to get items', error);
            }
        }

        fetchItems();
    }, [])
  return (
    <>
        {products.map((item) => (
            <MenuCard 
                key = {item._id}
                name = {item.name}
                category = {item.category}
                description = {item.description}
                image = {item.image}
                price = {item.price}
                count={props.counts[item._id] || 0}
                updateCount={props.updateCount}
                _id = {item._id}
            />
        ))}
    </>
  )
}

export default MenuCardWrapper