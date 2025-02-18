import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/NfcScreen.css";
import nfcImage from "../assets/nfclogo.png";

const NfcScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Estado do tipo de cadastro atualizado dinamicamente
  const [tipoCadastro, setTipoCadastro] = useState<string>(
    localStorage.getItem("tipoCadastro") || location.state?.tipoCadastro || "desconhecido"
  );

  // Estado do RFID
  const [rfidValue, setRfidValue] = useState("");

  useEffect(() => {
    console.log("Limpando cache do NFC...");
    localStorage.removeItem("rfidValue"); // Remove o valor salvo do NFC
    setRfidValue(""); // Reseta o estado
  }, [location.pathname]); // 🔥 Agora limpa sempre que a URL mudar!

  // Atualiza o tipo de cadastro sempre que a página for acessada
  useEffect(() => {
    if (location.state?.tipoCadastro) {
      console.log("Atualizando tipoCadastro:", location.state.tipoCadastro);
      setTipoCadastro(location.state.tipoCadastro);
      localStorage.setItem("tipoCadastro", location.state.tipoCadastro);
    }
  }, [location.state]); // 🔥 Agora monitora mudanças no `location.state`

  useEffect(() => {
    console.log("Tipo de cadastro recebido:", tipoCadastro);

    const handlePaste = async () => {
      const pastedData = await navigator.clipboard.readText();
      if (pastedData) {
        console.log("Valor NFC recebido:", pastedData);
        setRfidValue(pastedData);
        localStorage.setItem("rfidValue", pastedData);
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [tipoCadastro]);

  const handleConfirm = () => {
    console.log("Confirmado com RFID:", rfidValue);

    let destino = "/";
    if (tipoCadastro === "completo") destino = "/cadastrocompleto";
    else if (tipoCadastro === "rapido") destino = "/cadastrorapido";
    else if (tipoCadastro === "login") destino = "/login";

    navigate(destino, { state: { tipoCadastro, rfid: rfidValue } });
  };

  // Verifica se o rfidValue tem um UUID válido antes de habilitar o botão
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
