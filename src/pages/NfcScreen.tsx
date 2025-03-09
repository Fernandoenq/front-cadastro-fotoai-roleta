import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useRfidApi from "../hooks/useRfidApi"; // 🔹 Importando o hook
import "../styles/NfcScreen.css";
import nfcImage from "../assets/nfclogo.png";

const NfcScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rfidValue, clearRetryInterval, resetRfidApi } = useRfidApi(); // 🔹 Usando o hook

  const [tipoCadastro, setTipoCadastro] = useState<string>(
    localStorage.getItem("tipoCadastro") || location.state?.tipoCadastro || "desconhecido"
  );

  useEffect(() => {
    console.log("Limpando cache do NFC...");
    localStorage.removeItem("rfidValue");
  }, [location.pathname]);

  useEffect(() => {
    if (location.state?.tipoCadastro) {
      console.log("Atualizando tipoCadastro:", location.state.tipoCadastro);
      setTipoCadastro(location.state.tipoCadastro);
      localStorage.setItem("tipoCadastro", location.state.tipoCadastro);
    }
  }, [location.state]);

  const handleAction = (destino?: string) => {
    console.log("Ação acionada, parando consultas e resetando estado.");
    clearRetryInterval(); // Para qualquer reconsulta
    resetRfidApi(); // Reseta os estados do RFID (para ignorar a primeira chamada depois)

    if (destino) {
      navigate(destino, { state: { tipoCadastro, rfid: rfidValue } });
    } else {
      navigate(-1); // Voltar para a página anterior
    }
  };

  const isUUIDValid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{2}$/.test(rfidValue);

  return (
    <div className="nfc-container">
      <h1 className="nfc-title">Passe o cartão</h1>
      <img src={nfcImage} alt="NFC" className="nfc-image" />
      <p className="rfid-data">{rfidValue ? `Cartão: ${rfidValue}` : "Aguardando leitura..."}</p>

      <button className="nfc-button" onClick={() => handleAction()} style={{ marginBottom: "10px" }}>
        Voltar
      </button>

      <button className="nfc-button" onClick={() => handleAction(getDestino())} disabled={!isUUIDValid}>
        Confirmar
      </button>
    </div>
  );

  function getDestino() {
    if (tipoCadastro === "completo") return "/cadastrocompleto";
    if (tipoCadastro === "rapido") return "/cadastrorapido";
    if (tipoCadastro === "login") return "/login";
    return "/";
  }
};

export default NfcScreen;
