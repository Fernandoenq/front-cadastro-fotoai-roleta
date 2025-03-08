import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useRfidApi from "../hooks/useRfidApi"; // 🔹 Importando o hook
import "../styles/NfcScreen.css";
import nfcImage from "../assets/nfclogo.png";

const NfcScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rfidValue, clearRetryInterval } = useRfidApi(); // 🔹 Usando o hook

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

  const handleConfirm = () => {
    console.log("Confirmado com RFID:", rfidValue);

    let destino = "/";
    if (tipoCadastro === "completo") destino = "/cadastrocompleto";
    else if (tipoCadastro === "rapido") destino = "/cadastrorapido";
    else if (tipoCadastro === "login") destino = "/login";

    navigate(destino, { state: { tipoCadastro, rfid: rfidValue } });

    // 🛑 Parar a reconsulta ao sair da tela
    clearRetryInterval();
  };

  const isUUIDValid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{2}$/.test(rfidValue);

  return (
    <div className="nfc-container">
      <h1 className="nfc-title">Passe o cartão</h1>
      <img src={nfcImage} alt="NFC" className="nfc-image" />
      <p className="rfid-data">{rfidValue ? `Cartão: ${rfidValue}` : "Aguardando leitura..."}</p>
      <button className="nfc-button" onClick={handleConfirm} disabled={!isUUIDValid}>
        Confirmar
      </button>
    </div>
  );
};

export default NfcScreen;
