import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../styles/FullRegistration.css";
import { useApi } from "../hooks/useApi";
import { validateCpf, formatCpf, unformatCpf } from "../utils/cpfUtils";
import { validateWhatsapp, formatWhatsapp, unformatWhatsapp } from "../utils/whatsappUtils";
import { validateEmail } from "../utils/emailUtils";
import Popup from "../components/Popup";
import { handleCadastro } from "../utils/formUtils";
import AgeDropdown from "../components/AgeDropdown";

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
    idadePerfil: "",
    organizerId: localStorage.getItem("OrganizerId") || "" 
  });

  useEffect(() => {
    const storedOrganizerId = localStorage.getItem("OrganizerId");
    if (storedOrganizerId) {
      console.log("OrganizerId encontrado:", storedOrganizerId);
      setFormData((prev) => ({
        ...prev,
        organizerId: storedOrganizerId,
      }));
    } else {
      console.warn("⚠ OrganizerId não encontrado no localStorage!");
    }
  }, []);

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [activeField, setActiveField] = useState<keyof typeof formData | null>(null);
  const [inputName, setInputName] = useState<keyof typeof formData>("nome");
  const [keyboardLayout, setKeyboardLayout] = useState<"default" | "symbols">("default"); // 🔹 Alternador de layout

  const cpfRef = useRef<HTMLInputElement | null>(null);
  const whatsappRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const isValid =
      formData.nome.trim() !== "" &&
      validateCpf(formData.cpf) &&
      validateWhatsapp(formData.whatsapp) &&
      validateEmail(formData.email) &&
      formData.lgpd &&
      formData.idadePerfil !== "";

    setIsButtonEnabled(isValid);
  }, [formData]);

  const handleKeyboardChange = (input: string) => {
    console.log(`⌨ Teclado Virtual digitou em ${inputName}:`, input);
    setFormData((prev) => ({
      ...prev,
      [inputName]: input,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(`✏ Editando ${name}:`, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    console.log(`✅ Checkbox ${name} alterado para:`, checked);
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleFieldClick = (field: keyof typeof formData, ref?: React.RefObject<HTMLInputElement | null>) => {
    if (activeField === field) {
      console.log(`🟡 ${field} já está ativo, mantendo sem formatar.`);
      return;
    }

    console.log(`🔄 Mudando campo ativo para: ${field}`);

    if (activeField === "cpf") {
      setFormData((prev) => ({
        ...prev,
        cpf: formatCpf(prev.cpf),
      }));
      console.log("✅ CPF formatado.");
    }

    if (activeField === "whatsapp") {
      setFormData((prev) => ({
        ...prev,
        whatsapp: formatWhatsapp(prev.whatsapp),
      }));
      console.log("✅ WhatsApp formatado.");
    }

    setInputName(field);
    setActiveField(field);

    setTimeout(() => ref?.current?.focus(), 0);
  };

  const handleCpfClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    console.log("📌 CPF Selecionado! Removendo formatação...");
    setFormData((prev) => ({
      ...prev,
      cpf: unformatCpf(prev.cpf),
    }));
    handleFieldClick("cpf", cpfRef);
  };

  const handleWhatsappClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    console.log("📌 WhatsApp Selecionado! Removendo formatação...");
    setFormData((prev) => ({
      ...prev,
      whatsapp: unformatWhatsapp(prev.whatsapp),
    }));
    handleFieldClick("whatsapp", whatsappRef);
  };

  const handleClickFora = (e: React.MouseEvent<HTMLDivElement>) => {
    const isClickOnKeyboard = e.target instanceof HTMLElement && e.target.closest(".keyboard-container");

    if (!isClickOnKeyboard) {
      console.log("🖱 Clique fora do teclado, formatando CPF e WhatsApp."); 
    }
  };

  return (
    <div className="cadastro-container" onClick={handleClickFora}>
      <Popup show={showPopup} message={popupMessage} />

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
              "{symbols} {bksp} {space}"
            ],
            symbols: [
              "! # $ % & * + / = ? ^ ` ~",
              "{ } [ ] ( ) < > | \\ \" '",
              ": ; , . _ - @",
              "{default} {bksp} {space}"
            ]
          }}
          display={{ "{bksp}": "Apagar", "{space}": "Espaço", "{symbols}": "?123", "{default}": "ABC" }}
          onKeyPress={(button) => {
            if (button === "{symbols}") setKeyboardLayout("symbols");
            if (button === "{default}") setKeyboardLayout("default");
          }}
          layoutName={keyboardLayout}
        />
      </div>

      <div className="input-container">
        <label className="input-label">Nome:</label>
        <input type="text" name="nome" className="input-field" placeholder="Nome" value={formData.nome} onChange={handleInputChange} onClick={() => handleFieldClick("nome")} />
      </div>

      <div className="input-container">
        <label className="input-label">CPF:</label>
        <input ref={cpfRef} type="text" name="cpf" className="input-field" placeholder="CPF" value={formData.cpf} onChange={handleInputChange} onClick={handleCpfClick} />
      </div>

      <div className="input-container">
        <label className="input-label">Whatsapp:</label>
        <input ref={whatsappRef} type="text" name="whatsapp" className="input-field" placeholder="(99) 99999-9999" value={formData.whatsapp} onChange={handleInputChange} onClick={handleWhatsappClick} />
      </div>

      <div className="input-container">
        <label className="input-label">Email:</label>
        <input ref={emailRef} type="text" name="email" className="input-field" placeholder="Email" value={formData.email} onChange={handleInputChange} onClick={() => handleFieldClick("email", emailRef)} />
      </div>

      <AgeDropdown value={formData.idadePerfil} onChange={handleInputChange} />
        
      <div className="checkbox-container">
        <label className="checkbox-label">
          <input type="checkbox" name="lgpd" checked={formData.lgpd} onChange={handleCheckboxChange} />
          <span>Termo de responsabilidade e segurança de acordo com LGPD</span>
        </label>
      </div>

      <div className="checkbox-container">
        <label className="checkbox-label">
          <input type="checkbox" name="correntista" checked={formData.correntista} onChange={handleCheckboxChange} />
          <span>Correntista Bradesco?</span>
        </label>
      </div>

      <button
        className="cadastro-button"
        onClick={() => handleCadastro(formData, callApi, navigate)}
        disabled={!isButtonEnabled}
      >
  CADASTRAR
</button>


    </div>
  );
};

export default CadastroCompleto;
