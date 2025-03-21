import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../styles/LoginScreen.css";
import logo from "../assets/logo.png";
import { useApi } from "../hooks/useApi";
import Popup from "../components/Popup";

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { callApi, showPopup, popupMessage } = useApi();
  const [login, setLogin] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const [inputName, setInputName] = useState<"login" | "secretKey">("login");
  const [showKeyboard, setShowKeyboard] = useState<boolean>(true);

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setShowKeyboard(!isMobile || window.innerWidth > 768);
  }, []);

  const handleKeyboardChange = (input: string) => {
    if (inputName === "login") {
      setLogin(input);
    } else {
      setSecretKey(input);
    }
  };

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
        navigate("/redirectscreen");
      }, 1000);
    }
  };

  return (
    <div className="login-container">
      <Popup show={showPopup} message={popupMessage} />
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
          onFocus={() => setInputName("login")}
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
          onFocus={() => setInputName("secretKey")}
        />
      </div>

      <button className="login-button" onClick={handleLogin} disabled={!login || !secretKey}>
        Entrar
      </button>

      {showKeyboard && (
        <div className="keyboard-container">
          <Keyboard
            onChange={handleKeyboardChange}
            inputName={inputName}
            layout={{
              default: [
                "1 2 3 4 5 6 7 8 9 0 - _ @",
                "q w e r t y u i o p",
                "a s d f g h j k l",
                "z x c v b n m .",
                "{bksp} {space}"
              ]
            }}
            display={{ "{bksp}": "Apagar", "{space}": "Espaço" }}
          />
        </div>
      )}

      <p className="footer-text">HOLDING CLUBE</p>
    </div>
  );
};

export default LoginScreen;
