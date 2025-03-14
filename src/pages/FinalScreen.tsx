import React from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useFetchBalanceByCpf } from "../hooks/useFetchBalanceByCpf"; // ✅ Usando o hook correto
import "../styles/FinalScreen.css";

const FinalScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const cpf = localStorage.getItem("cpf") || "";
  const { balanceCurrentValue, userName, loading, error } = useFetchBalanceByCpf(cpf); // ✅ Hook correto

  const randomQRCodeURL = "https://bradesco.picbrand.dev.br/login";

  return (
    <div className="final-container">
      <h1>Obrigado por ter participado</h1>
      <p>Parabéns {userName || "usuário"}</p>

      <div className="saldo">
        {loading ? (
          <span>Carregando...</span>
        ) : error ? (
          <span className="text-danger">{error}</span>
        ) : (
          <span>Seu saldo atual: {balanceCurrentValue}</span>
        )}
      </div>

      <p>Caso queira ver toda a sua carteira de pontos, leia o QRCode abaixo</p>

      <div className="qrcode">
        <QRCodeSVG value={randomQRCodeURL} size={520} />
      </div>

      <button onClick={() => navigate("/redirectscreen")}>Fechar</button>
    </div>
  );
};

export default FinalScreen;
