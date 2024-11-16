import React, { useState } from "react";
import './styles.css';
import logoImage from '../../assets/Dm_Logo.png';
import logo from '../../assets/Logo_crop.png';
import api from '../../services/api'
import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/user/dashboard";

  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');




  async function handleLogin(e) {
    e.preventDefault();
    const data = {
      username: userName,
      password: password
    };
    try {
      const response = await api.post('login', data,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }

      );

      const access_token = response.data.access_token;
      setAuth({ 'user': userName, 'access_token': access_token });
      navigate(from, { replace: true });


    } catch (error) {
      console.log('Err')
    }
  }
  return (
    <div className="login-container">
      <section className="login-form">
        <img src={logo} alt="Login" />
        <form onSubmit={handleLogin}>
          <h1>Área administrativa</h1>
          <input
            placeholder="Username"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="button-login" type="submit">Login</button>
        </form>

      </section>
    </div>
  );
}