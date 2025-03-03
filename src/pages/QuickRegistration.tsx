import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../styles/QuickRegistration.css";
import { validateCpf } from "../utils/cpfUtils";
import { useApi } from "../hooks/useApi";
import Popup from "../components/Popup";

const CadastroRapido: React.FC = () => {
  const navigate = useNavigate();
  const { callApi, showPopup, popupMessage } = useApi();
  const [rfidValue, setRfidValue] = useState(localStorage.getItem("rfidValue") || "");
  const [cpf, setCpf] = useState("");
  const [isCpfValid, setIsCpfValid] = useState(false);
  const [inputName, setInputName] = useState("cpf");
  const [apiResponse, setApiResponse] = useState(null);

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setCpf(rawValue);
    setIsCpfValid(validateCpf(rawValue));
  };

  const handleKeyboardChange = (input: string) => {
    setCpf(input);
    setIsCpfValid(validateCpf(input));
  };

  const handleCadastro = async () => {
    const organizerId = localStorage.getItem("OrganizerId");

    const payload = {
      Cpf: cpf,
      ExternalCode: rfidValue,
      OrganizerId: organizerId ? parseInt(organizerId) : null,
    };
    console.log(payload)
    localStorage.setItem("cpf", cpf);
    const result = await callApi("//Person/SetExternalCode", "PUT", payload);

    setApiResponse(result);
    console.log("Resposta da API:", result);

    if (result !== null) {
      console.log("✅ Cadastro bem-sucedido! Resposta da API:", result);
      navigate("/camera");
    } else {
      console.error("❌ Erro no cadastro. Verifique a resposta da API.");
    }
  };

  return (
    <div className="cadastro-container">
      <Popup show={showPopup} message={popupMessage} />

      <h1 className="cadastro-title">CADASTRO RÁPIDO</h1>
      <p className="cadastro-subtitle">Bradesco Lollapalooza 2025</p>

      <h2 className="cadastro-vinculo">CONFIRMAR VÍNCULO COM O CARTÃO</h2>

      <p className="uuid-text">Cartão: {rfidValue || "Aguardando leitura..."}</p>

      <div className="input-container">
        <label className="input-label">CPF:</label>
        <input
          type="text"
          className="input-field"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={handleCpfChange}
          onFocus={() => setInputName("cpf")}
          maxLength={14}
        />
        {!isCpfValid && cpf.length === 14 && <p className="error-text">CPF inválido!</p>}
      </div>

      <div className="keyboard-container">
        <Keyboard
          onChange={handleKeyboardChange}
          inputName={inputName}
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
