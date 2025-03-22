import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useRfidApi from "../hooks/useRfidApi";
import "../styles/NfcScreen.css";

const NfcScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rfidValue, clearRetryInterval, resetRfidApi } = useRfidApi();

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

  useEffect(() => {
    console.log("Valor do cartão NFC detectado:", rfidValue);
  }, [rfidValue]);

  const handleAction = (destino?: string) => {
    console.log("Ação acionada, parando consultas e resetando estado.");
    clearRetryInterval();
    resetRfidApi();

    if (destino) {
      navigate(destino, { state: { tipoCadastro, rfid: rfidValue } });
    } else {
      navigate("/redirectscreen");
    }
  };

  const isUUIDValid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(rfidValue || "");

  return (
    <div className="nfc-screen-container">
      <h1 className="nfc-title">Aproxime seu cartão da maquininha</h1>
      <h1 className="nfc-subtitle">e conclua o cadastro.</h1>

      <button
        className="nfc-confirm-button"
        onClick={() => handleAction(getDestino())}
        disabled={!isUUIDValid}
      >
        CONFIRMAR
      </button>
    </div>
  );

  function getDestino() {
    if (tipoCadastro === "completo") return "/cadastrocompleto";
    if (tipoCadastro === "rapido") return "/cadastrorapido";
    if (tipoCadastro === "login") return "/login";
  }
};

export default NfcScreen;
