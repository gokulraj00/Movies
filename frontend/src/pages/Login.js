import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Import the CSS file

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('${process.env.REACT_APP_BACKEND_URL}/api/users/login', { username, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userID);
            console.log(response.data.userID);
            navigate("/home");
        } catch (error) {
            console.error('Error logging in', error);
        }
    };
    const register = () => {
        navigate("/register");
    }

    return (
        <div className="login-container">
            <h1>Login</h1>
            <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Username" 
            />
            <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
            />
            <button onClick={handleLogin}>Login</button>
            <button onClick={register}>Register</button>
        </div>
    );
};

export default Login;
