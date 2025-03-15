import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RedirectScreen.css";

const RedirectScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleRedirect = (type: string) => {
    navigate("/nfcscreen", { state: { tipoCadastro: type } });
  };

  return (
    <div className="redirect-container">
      <h1 className="redirect-title">Login / Cadastro</h1>
      <button className="redirect-button" onClick={() => handleRedirect("completo")}>
        Cadastro completo
      </button>
      <button className="redirect-button" onClick={() => handleRedirect("rapido")}>
        Cadastro rápido
      </button>
      
    </div>
  );
};

export default RedirectScreen;
