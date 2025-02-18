import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LoginScreen.css";
import logo from "../assets/logo.png"; 
import { useApi } from "../hooks/useApi"; 

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { callApi, showPopup, popupMessage } = useApi(); 
  const [login, setLogin] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");

  const handleLogin = async () => {
    const loginData = {
      Login: login,
      SecretKey: secretKey,
    };
  
    const response = await callApi("/Organizer/Login", "PUT", loginData);
  
    if (response && response.Organizers && response.Organizers.length > 0) { 
      localStorage.setItem("OrganizerId", response.Organizers[0].OrganizerId.toString());
      console.log("OrganizerId salvo:", localStorage.getItem("OrganizerId"));
  
      setTimeout(() => {
        navigate("/redirectscreen"); // ✅ Garante que o redirecionamento ocorra
      }, 1000); // Pequeno delay para garantir a atualização do estado
    }
  };
  
  return (
    <div className="login-container">
      {showPopup && <div className="popup top-right">{popupMessage}</div>}

      <img src={logo} alt="Logo" className="login-logo" />
      <h1 className="login-title">Login do promotor</h1>

      <div className="input-container">
        <label htmlFor="username">Usuário:</label>
        <input 
          type="text" 
          id="username" 
          placeholder="Digite seu usuário" 
          value={login} 
          onChange={(e) => setLogin(e.target.value)} 
        />
      </div>

      <div className="input-container">
        <label htmlFor="password">Senha:</label>
        <input 
          type="password" 
          id="password" 
          placeholder="Digite sua senha" 
          value={secretKey} 
          onChange={(e) => setSecretKey(e.target.value)} 
        />
      </div>

      <button className="login-button" onClick={handleLogin} disabled={!login || !secretKey}>
        Entrar
      </button>

      <p className="footer-text">HOLDING CLUBE</p>
    </div>
  );
};

export default LoginScreen;
