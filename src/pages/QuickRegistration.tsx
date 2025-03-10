import React, { useState, useRef, useEffect  } from "react";
import { useNavigate } from "react-router-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../styles/QuickRegistration.css";
import { validateCpf, formatCpf, unformatCpf } from "../utils/cpfUtils";
import { useApi } from "../hooks/useApi";
import Popup from "../components/Popup";

const CadastroRapido: React.FC = () => {
  const navigate = useNavigate();
  const { callApi, showPopup, popupMessage } = useApi();
  const [rfidValue, setRfidValue] = useState(localStorage.getItem("rfidValue") || "");
  const [cpf, setCpf] = useState("");
  const [isCpfValid, setIsCpfValid] = useState(false);
  const [activeField, setActiveField] = useState<"cpf" | null>(null);

  // Referência para o campo CPF
  const cpfRef = useRef<HTMLInputElement | null>(null);

  const handleKeyboardChange = (input: string) => {
    console.log(`⌨ Teclado Virtual digitou em CPF:`, input);
    setCpf(input);
    setIsCpfValid(validateCpf(input));
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = unformatCpf(e.target.value);
    console.log(`✏ Editando CPF:`, rawValue);
    setCpf(rawValue);
    setIsCpfValid(validateCpf(rawValue));
  };

  const handleCpfClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    console.log("📌 CPF Selecionado! Removendo formatação...");
    setCpf(unformatCpf(cpf));
    setActiveField("cpf");

    setTimeout(() => cpfRef.current?.focus(), 0);
  };

  useEffect(() => {
    const storedRfid = localStorage.getItem("rfidValue");
    if (storedRfid) {
      console.log("🎟 RFID recuperado do localStorage:", storedRfid);
      setRfidValue(storedRfid);
    } else {
      console.warn("⚠ Nenhum RFID encontrado no localStorage.");
    }
  }, []);

  const handleClickFora = (e: React.MouseEvent<HTMLDivElement>) => {
    const isClickOnKeyboard = e.target instanceof HTMLElement && e.target.closest(".keyboard-container");

    if (!isClickOnKeyboard && activeField === "cpf") {
      console.log("🖱 Clique fora do campo CPF, formatando...");
      setCpf(formatCpf(cpf));
      setActiveField(null);
    }
  };

  const handleCadastro = async () => {
    const cpfSemFormatacao = unformatCpf(cpf);
    const organizerId = localStorage.getItem("OrganizerId");

    const payload = {
      Cpf: cpfSemFormatacao,
      ExternalCode: rfidValue,
      OrganizerId: organizerId ? parseInt(organizerId) : null,
    };

    console.log("📤 Enviando dados para API:", payload);
    localStorage.setItem("cpf", cpfSemFormatacao);
    const result = await callApi("//Person/SetExternalCode", "PUT", payload);

    console.log("🔄 Resposta da API:", result);

    if (result !== null) {
      console.log("✅ Cadastro bem-sucedido! Resposta da API:", result);
      navigate("/camera");
    } else {
      console.error("❌ Erro no cadastro. Verifique a resposta da API.");
    }
  };

  return (
    <div className="cadastro-container" onClick={handleClickFora}>
      <Popup show={showPopup} message={popupMessage} />

      <h1 className="cadastro-title">CADASTRO RÁPIDO</h1>
      <p className="cadastro-subtitle">Bradesco Lollapalooza 2025</p>

      <h2 className="cadastro-vinculo">CONFIRMAR VÍNCULO COM O CARTÃO</h2>

      <p className="uuid-text">Cartão: {rfidValue || "Aguardando leitura..."}</p>

      <div className="input-container">
        <label className="input-label">CPF:</label>
        <input
          ref={cpfRef}
          type="text"
          className="input-field"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={handleCpfChange}
          onClick={handleCpfClick}
        />
      </div>

      <div className="keyboard-container">
        <Keyboard
          onChange={handleKeyboardChange}
          layout={{
            default: [
              "1 2 3 4 5 6 7 8 9 0",
              "{bksp}"
            ]
          }}
          display={{ "{bksp}": "Apagar" }}
        />
      </div>

      <button className="cadastro-button" onClick={handleCadastro} disabled={!isCpfValid}>
        CADASTRAR
      </button>

      <p className="footer-text">HOLDING CLUBE</p>
    </div>
  );
};

export default CadastroRapido;
