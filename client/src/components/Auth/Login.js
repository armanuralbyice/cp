import React, { useState } from 'react';
import logo from './East-west-university-LogoSVG.svg.png';
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from '../Router/AuthProvider';
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const { setIsAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await axios.post('https://cp-wine-mu.vercel.app/auth/login', { email, password })
                .then(response => {
                    setIsAuthenticated(true);
                    const { user, token } = response.data;
                    localStorage.setItem('token', token);
                    localStorage.setItem('role', user.role);
                    localStorage.setItem('name', user.name);
                    localStorage.setItem('email', user.email)
                    if (response && response.status === 200) {
                        navigate('/home')
                    }
                })
        } catch (error) {
            if (error.response) {
                console.error('Response data:', error.response.data);
            }
            setError('Invalid email or password');
        }
    };
    return (
        <div style={{ overflow: 'hidden', height: '100vh' }}>
            <div className="container-login">
                <div className="wrapper-login">
                    <div className="logo">
                        <img src={logo} alt="East West University Logo" />
                    </div>
                    <div className="title">
                        <h6>SIGN IN TO YOUR ACCOUNT</h6>
                    </div>
                    {error && <div className="error" style={{ 'textAlign': 'center', 'fontSize': '18px', 'color': 'red' }}>{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="row">
                            <i><FontAwesomeIcon icon={faEnvelope} /></i>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </div>
                        <div className="row">
                            <i><FontAwesomeIcon icon={faLock} /></i>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                            />
                        </div>
                        <div className="pass"><a href="#">Forgot password?</a></div>
                        <div className="row button-login">
                            <input type="submit" value="Login" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
