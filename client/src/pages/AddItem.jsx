import React from 'react'
import './AddItem.css'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import axios from 'axios';

const AddItem = () => {
    const navigate = useNavigate();
    const [data,setData] = useState({
        name : '',
        category : '',
        description : '',
        image : '',
        price : '',
    })

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file){
            setSelectedFile(file);
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile){
            alert('choose an image for the food item');
            return;
        }

        let imageUrl = '';

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const uploadImage = await axios.post('http://localhost:3000/api/upload', formData);
            imageUrl = uploadImage.data.imageUrl;

        } catch (error) {
            console.log(error);
        }
        

        const finalData = {
            ...data,
            image : imageUrl,
            price : parseFloat(data.price), // ✅ convert string to number here
        };
        console.log({finalData});

        try {
            const upload = await axios.post('http://localhost:3000/api/add-item', finalData);
            if (upload){
                setData({
                    name: '',
                    category: '',
                    description: '',
                    image: '',
                    price: '',
                });
                navigate('/Dashboard');
            }
        } catch (error) {
            console.error('Error uploading data', error);
        }
    }

  return (
    <div className="add-item-wrapper">
        <form className="add-item-form" onSubmit={handleSubmit}>
            <h3>Add Item</h3>

            <div className="add-item-name-category">

                <div className="add-item-element">
                    <label>Name</label>
                    <input type="text" 
                        placeholder="Enter Name of Food Item" 
                        value = {data.name} onChange={(e) => setData({...data, name : e.target.value})}></input>
                </div>

                <div className="add-item-element">
                    <label>Category</label>
                    <select className="category" value = {data.category} onChange={(e) => setData({...data, category : e.target.value})}>
                        <option>-- Select --</option>
                        <option>Starters</option>
                        <option>Main Course</option>
                        <option>Dessert</option>
                        <option>Drinks</option>
                    </select>
                </div>

            </div>

            <div className="add-item-description">
                <div className="add-item-element">
                    <label>Description</label>
                    <textarea
                        placeholder="Description about the product"
                        value={data.description}
                        onChange={(e) => setData({ ...data, description: e.target.value })}
                        ></textarea>
                </div>
            </div>

            <div className="add-item-image-price">
                <div className="add-item-element">
                    <label>Image</label>
                    <input className="file-input" type="file" accept="image/*" onChange={handleFileChange}></input>
                </div>

                <div className="add-item-element">
                    <label>Price</label>
                    <input type="number" 
                        placeholder="Enter Price" 
                        value = {data.price} onChange={(e) => setData({...data, price : e.target.value})}></input>
                </div>
            </div>

            <button className="add-item-button" type="submit">Create</button>
        </form>
    </div>
  )
}

export default AddItem