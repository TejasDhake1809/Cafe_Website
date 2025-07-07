import React, {useState} from 'react'
import './TableBody.css'
import axios from 'axios';
import toast from 'react-hot-toast'

const TableBody = (props) => {
    const [mouseOn, setMouseOn] = useState(false);
    const handleClick = async() => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`http://localhost:3000/api/items/${props.id}`);
            toast.success(response.data.success);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to delete item");
        }
    }
  return (
        <tr className="justarandomclassname">
            <td>{props.id}</td>
            <td>{props.name}</td>
            <td>{props.category}</td>
            <td>{props.price}</td>
            <td> <img src={props.image} style={{height : "40px", width : "40px"}}/>  </td>
            <td> <button onClick={handleClick}
                    onMouseEnter={() => setMouseOn(true)} onMouseLeave={() => setMouseOn(false)} > 
                    <img src={`https://img.icons8.com/?size=100&id=6483&format=png&color=${mouseOn ? "ffffff" : "FF0000"}`} style={{height : "25px", width : "25px"}}/> 
                </button>  
            </td>
        </tr>
  )
}

export default TableBody