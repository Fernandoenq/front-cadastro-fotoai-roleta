import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RedirectScreen.css";
import bradescoLogo from "../assets/logos/bralolla.png";

const RedirectScreen: React.FC = () => {
  const navigate = useNavigate();
  const handleRedirect = (type: string) => {
    if (type === "cadastrorapido") {
      navigate("/cadastrorapido"); // <- corrigido aqui
    } else {
      navigate("/nfcscreen", { state: { tipoCadastro: type } });
    }
  };

  return (
    <div className="redirect-container">
      <h1 className="redirect-title">
        Bora começar <br /> sua jornada?
      </h1>

      <div className="redirect-buttons">
        <button className="redirect-button fast-signup" onClick={() => handleRedirect("cadastrorapido")} 
           style={{
          
            fontSize: "2vh", // Ajusta o tamanho da fonte para 54px
          }}>
          já sou cadastrado
        </button>

        <button className="redirect-button full-signup" onClick={() => handleRedirect("completo")}  style={{
          
          fontSize: "2vh", // Ajusta o tamanho da fonte para 54px
        }}>
          não tenho cadastro
        </button>

        <div className="logo-container">
          <img src={bradescoLogo} alt="Bradesco" className="logos" />
        </div>
      </div>
    </div>
  );
};

export default RedirectScreen;
