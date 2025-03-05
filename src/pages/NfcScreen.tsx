import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/NfcScreen.css";
import nfcImage from "../assets/nfclogo.png";

const NfcScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [tipoCadastro, setTipoCadastro] = useState<string>(
    localStorage.getItem("tipoCadastro") || location.state?.tipoCadastro || "desconhecido"
  );

  const [rfidValue, setRfidValue] = useState("");

  useEffect(() => {
    console.log("Limpando cache do NFC...");
    localStorage.removeItem("rfidValue");
    setRfidValue("");
  }, [location.pathname]);

  useEffect(() => {
    if (location.state?.tipoCadastro) {
      console.log("Atualizando tipoCadastro:", location.state.tipoCadastro);
      setTipoCadastro(location.state.tipoCadastro);
      localStorage.setItem("tipoCadastro", location.state.tipoCadastro);
    }
  }, [location.state]);

  useEffect(() => {
    const clearClipboard = async () => {
      try {
        await navigator.clipboard.writeText(""); // Limpa a área de transferência
        console.log("Área de transferência limpa com sucesso!");
      } catch (error) {
        console.error("Erro ao limpar a área de transferência:", error);
      }
    };
  
    // Verifica se o navegador suporta clipboard
    if (navigator.clipboard) {
      clearClipboard();
    } else {
      console.warn("Clipboard API não suportada neste navegador.");
    }
  }, []);
  

  useEffect(() => {
    console.log("Tipo de cadastro recebido:", tipoCadastro);

    const handlePaste = async () => {
      const pastedData = await navigator.clipboard.readText();
      if (pastedData) {
        console.log("Valor NFC recebido via CTRL+V:", pastedData);
        setRfidValue(pastedData);
        localStorage.setItem("rfidValue", pastedData);
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [tipoCadastro]);

  // ✅ Monitora a área de transferência do celular a cada 2 segundos
  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const clipboardData = await navigator.clipboard.readText();
        if (clipboardData && clipboardData !== rfidValue) {
          console.log("Valor recebido via Bluetooth/Área de Transferência:", clipboardData);
          setRfidValue(clipboardData);
          localStorage.setItem("rfidValue", clipboardData);
        }
      } catch (error) {
        console.error("Erro ao acessar a área de transferência:", error);
      }
    };

    const interval = setInterval(checkClipboard, 2000); // 🔥 Verifica a cada 2 segundos
    return () => clearInterval(interval);
  }, [rfidValue]);

  const handleConfirm = () => {
    console.log("Confirmado com RFID:", rfidValue);

    let destino = "/";
    if (tipoCadastro === "completo") destino = "/cadastrocompleto";
    else if (tipoCadastro === "rapido") destino = "/cadastrorapido";
    else if (tipoCadastro === "login") destino = "/login";

    navigate(destino, { state: { tipoCadastro, rfid: rfidValue } });
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
