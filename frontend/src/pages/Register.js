import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; 
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showMessage, setShowMessage] = useState(false); // State to manage message visibility
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await axios.post('${process.env.REACT_APP_BACKEND_URL}/api/users/register', { username, password });
            console.log("User created successfully");
            setShowMessage(true); // Show message after successful registration
            // Redirect to login page or another page
        } catch (error) {
            console.error('Error registering', error);
        }
    };
    const login = () => {
        navigate("/login");
    }

    return (
        <div className="login-container">
            <h1>Register</h1>
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
            <button onClick={handleRegister}>Register</button>
            <button onClick={login}>Login</button>
            {showMessage && <div className="success-message">User registered successfully!</div>}
        </div>
    );
};

export default Register;
