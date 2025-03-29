import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RedirectScreen.css";
import bradescoLogo from "../assets/logos/bralolla.png";

const RedirectScreen: React.FC = () => {
  const navigate = useNavigate();

  const fetchExternalCode = async () => {
    const organizerId = localStorage.getItem("OrganizerId");
    if (!organizerId) return;

    try {
      const response = await fetch(
        `https://api-back.picbrand.dev.br/Organizer/GenerateRegisterExternalCode/${organizerId}`,
        {
          method: "PUT",
        }
      );
      const data = await response.json();
      if (data.ExternalCode) {
        localStorage.setItem("rfidValue", data.ExternalCode);
      }
    } catch (error) {
      console.error("Erro ao gerar ExternalCode:", error);
    }
  };

  useEffect(() => {
    fetchExternalCode();
  }, []);

  const handleRedirect = async (type: string) => {
    await fetchExternalCode(); // refaz antes do redirecionamento

    if (type === "cadastrorapido") {
      navigate("/cadastrorapido");
    } else {
      navigate("/cadastrocompleto", { state: { tipoCadastro: type } });
    }
  };

  return (
    <div className="redirect-container">
      <h1 className="redirect-title">
        Bora começar <br /> sua jornada?
      </h1>

      <div className="redirect-buttons">
        <button
          className="redirect-button fast-signup"
          onClick={() => handleRedirect("cadastrorapido")}
          style={{
            fontSize: "2vh",
          }}
        >
          já sou cadastrado
        </button>

        <button
          className="redirect-button full-signup"
          onClick={() => handleRedirect("completo")}
          style={{
            fontSize: "2vh",
          }}
        >
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
