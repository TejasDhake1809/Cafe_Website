import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useRegister = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);
    const {dispatch} = useAuthContext();
    const navigate = useNavigate();

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const register = async (email, password) => {
        setIsLoading(true);
        setError(null);

        const response = await fetch (`${baseUrl}/register`,{
            method: 'POST',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify({email, password})
        })

        const json = await response.json();

        if (!response.ok) {
            setIsLoading(false);
            setError(json.error);
        }
        if (response.ok){
            //save user to local storage
            localStorage.setItem('user', JSON.stringify(json));

            //update authcontext
            dispatch({type : 'LOGIN', payload : json})

            setIsLoading(false);
            navigate("/");
        }

    }

    return {register, isLoading, error};
}