import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../styles/FullRegistration.css";
import { useApi } from "../hooks/useApi";
import { validateCpf } from "../utils/cpfUtils";
import { validateWhatsapp } from "../utils/whatsappUtils";
import { validateEmail } from "../utils/emailUtils";

const CadastroCompleto: React.FC = () => {
  const navigate = useNavigate();
  const { callApi, showPopup, popupMessage } = useApi();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    whatsapp: "",
    email: "",
    lgpd: false,
    correntista: false,
  });

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  useEffect(() => {
    const isValid =
      formData.nome.trim() !== "" &&
      validateCpf(formData.cpf) &&
      validateWhatsapp(formData.whatsapp) &&
      validateEmail(formData.email) &&
      formData.lgpd;
    
    setIsButtonEnabled(isValid);
  }, [formData]);

  const [inputName, setInputName] = useState<keyof typeof formData>("nome");

  const handleKeyboardChange = (input: string) => {
    setFormData((prev) => ({ ...prev, [inputName]: input }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  const [apiResponse, setApiResponse] = useState(null);
  const handleCadastro = async () => {

    const registerData = {
      PersonName: formData.nome,
      Cpf: formData.cpf,
      Phone: `55${formData.whatsapp}`,
      Mail: formData.email,
      HasAcceptedTerm: formData.lgpd,
      HasAccount: formData.correntista,
      ExternalCode: localStorage.getItem("rfidValue") || ""
    }
    console.log(registerData)
    localStorage.setItem("cpf", registerData.Cpf);
    const result = await callApi("/Person/Person", "POST", registerData);
    
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
      {showPopup && <div className="popup top-right">{popupMessage}</div>}

      <h1 className="cadastro-title">CADASTRO USUÁRIO</h1>
      <p className="cadastro-subtitle">Bradesco Lollapalooza 2025</p>

      <div className="keyboard-container">
        <Keyboard
          onChange={handleKeyboardChange}
          inputName={inputName}
          layout={{
            default: [
              "1 2 3 4 5 6 7 8 9 0 - _ @",
              "q w e r t y u i o p",
              "a s d f g h j k l",
              "z x c v b n m .",
              "{bksp} {space}"
            ]
          }}
          display={{ "{bksp}": "Apagar", "{space}": "Espaço" }}
        />
      </div>

      <div className="input-container">
        <label className="input-label">Nome:</label>
        <input
          type="text"
          name="nome"
          className="input-field"
          placeholder="Nome"
          value={formData.nome}
          onChange={handleInputChange}
          onFocus={() => setInputName("nome")}
        />
      </div>

      <div className="input-container">
        <label className="input-label">CPF:</label>
        <input
          type="text"
          name="cpf"
          className="input-field"
          placeholder="CPF"
          value={formData.cpf}
          onChange={handleInputChange}
          onFocus={() => setInputName("cpf")}
        />
      </div>

      <div className="input-container">
        <label className="input-label">Whatsapp:</label>
        <input
          type="text"
          name="whatsapp"
          className="input-field"
          placeholder="(99) 99999-9999"
          value={formData.whatsapp}
          onChange={handleInputChange}
          onFocus={() => setInputName("whatsapp")}
        />
      </div>

      <div className="input-container">
        <label className="input-label">Email:</label>
        <input
          type="text"
          name="email"
          className="input-field"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          onFocus={() => setInputName("email")}
        />
      </div>

      <div className="checkbox-container">
        <label className="checkbox-label">
          <input type="checkbox" name="lgpd" checked={formData.lgpd} onChange={handleCheckboxChange} required />
          <span>Termo de responsabilidade e segurança de acordo com LGPD</span>
        </label>
      </div>

      <div className="checkbox-container">
        <label className="checkbox-label">
          <input type="checkbox" name="correntista" checked={formData.correntista} onChange={handleCheckboxChange} />
          <span>Correntista Bradesco?</span>
        </label>
      </div>

      <button className="cadastro-button" onClick={handleCadastro} disabled={!isButtonEnabled}>CADASTRAR</button>

      <p className="footer-text">HOLDING CLUBE</p>
    </div>
  );
};

export default CadastroCompleto;