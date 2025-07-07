import React, {useState, useEffect} from 'react'
import './Products.css';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import TableBody from './TableBody.jsx';

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [active,setActive] = useState("");

  const handleAddClick = () => {
    navigate("/add-item")
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/items", {
          params : {category : active}
        })
        if (response) {
          toast.success("Items fetched from database successfully");
          setProducts(response.data);
          console.log(response.data);
        }
      } catch (error) {
        toast.error ("Failed to fetch items from database");
      }
    }
    fetchData()
  },[active])
  // const [products, setProducts] = useState({});


  return (
    <div className="products-container">
        <div className="products-filters">
            <div className="products-filters-buttons">
              <button onClick={() => setActive("Starters")} className={active==="Starters" ? "filtersbtnactive filtersbtn" : "filtersbtn"}>
                <img src={`https://img.icons8.com/?size=100&id=56700&format=png&color=${active === "Starters" ? "ffffff" : "000000"}`}></img></button>

              <button onClick={() => setActive("Main Course")} className={active==="Main Course" ? "filtersbtnactive filtersbtn" : "filtersbtn"}>
                <img src={`https://img.icons8.com/?size=100&id=37380&format=png&color=${active === "Main Course" ? "ffffff" : "000000"}`}></img></button>

              <button onClick={() => setActive("Dessert")} className={active==="Dessert" ? "filtersbtnactive filtersbtn" : "filtersbtn"}>
                <img src={`https://img.icons8.com/?size=100&id=ErxOo3KxxsOG&format=png&color=${active === "Dessert" ? "ffffff" : "000000"}`}></img></button>

              <button onClick={() => setActive("Drinks")} className={active==="Drinks" ? "filtersbtnactive filtersbtn" : "filtersbtn"}>
                <img src={`https://img.icons8.com/?size=100&id=37211&format=png&color=${active === "Drinks" ? "ffffff" : "000000"}`}></img></button>
            </div>
            
            <div className="products-filters-addbuttons">
              <button onClick={handleAddClick} className="filtersbtn"><img src="https://img.icons8.com/?size=100&id=KY0T5QaIS9bn&format=png&color=000000"></img></button>
              <button className="filtersbtn"><img src="https://img.icons8.com/?size=100&id=qLN1lotHA65k&format=png&color=000000"></img></button>
            </div>
        </div>
        
        <div className="products-table">
            <table className="products-orders-table">
                    <thead>
                        <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Image</th>
                        <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                       {products.map((item) => {
                          return (
                            <TableBody 
                            key = {item._id}
                            id = {item._id}
                            name = {item.name}
                            category = {item.category}
                            price = {item.price}
                            image = {item.image}
                          />
                          )
                        })}
                    </tbody>
                   
                    </table>
        </div>
        <div className="products-bestselling">products-bestselling <br></br></div>
    </div>
  )
}

export default Products