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

interface FormData {
  nome: string;
  cpf: string;
  whatsapp: string;
  email: string;
  lgpd: boolean;
  correntista: boolean;
  idadePerfil: string;
  sexo: string;
  organizerId: string;
}

const CadastroCompleto: React.FC = () => {
  const navigate = useNavigate();
  const { callApi, showPopup, popupMessage } = useApi();

  const [formData, setFormData] = useState<FormData>({
    nome: "",
    cpf: "",
    whatsapp: "",
    email: "",
    lgpd: false,
    correntista: false,
    idadePerfil: "",
    sexo: "",
    organizerId: localStorage.getItem("OrganizerId") || ""
  });

  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [activeField, setActiveField] = useState<keyof FormData | null>(null);
  const [inputName, setInputName] = useState<keyof FormData>("nome");
  const [keyboardLayout, setKeyboardLayout] = useState<"default" | "symbols">("default");

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
      formData.idadePerfil !== "" &&
      formData.sexo !== "";

    setIsButtonEnabled(isValid);
  }, [formData]);

  const handleKeyboardChange = (input: string) => {
    setFormData((prev) => ({
      ...prev,
      [inputName]: input
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as keyof FormData]: value
    }));
  };

  const handleCheckboxChange = (field: keyof FormData, value: boolean | string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "boolean" ? value : prev[field] === value ? "" : value
    }));
  };

  const handleFieldClick = (field: keyof FormData, ref?: React.RefObject<HTMLInputElement | null>) => {
    if (activeField === field) return;

    if (activeField === "cpf") {
      setFormData((prev) => ({ ...prev, cpf: formatCpf(prev.cpf) }));
    }
    if (activeField === "whatsapp") {
      setFormData((prev) => ({ ...prev, whatsapp: formatWhatsapp(prev.whatsapp) }));
    }
    if (field === "cpf") {
      setFormData((prev) => ({ ...prev, cpf: unformatCpf(prev.cpf) }));
    }
    if (field === "whatsapp") {
      setFormData((prev) => ({ ...prev, whatsapp: unformatWhatsapp(prev.whatsapp) }));
    }

    setInputName(field);
    setActiveField(field);
    setTimeout(() => ref?.current?.focus(), 0);
  };

  return (
    <div className="cadastro-full-container">
      <Popup show={showPopup} message={popupMessage} />

     
      <style>
          {`
    .input-placeholder-white::placeholder {
      color: "#cd092f" !important; 
    }
  `}
        </style>
      <div className="cadastro-full-inputs">
        <input type="text" name="nome" className="cadastro-full-input input-placeholder-white" placeholder="Nome" value={formData.nome} onChange={handleInputChange} onClick={() => handleFieldClick("nome")} />
        <input type="text" name="cpf" className="cadastro-full-input input-placeholder-white" placeholder="CPF" value={formData.cpf} onChange={handleInputChange} onClick={() => handleFieldClick("cpf", cpfRef)} ref={cpfRef} />
        <input type="text" name="whatsapp" className="cadastro-full-input input-placeholder-white" placeholder="Whatsapp" value={formData.whatsapp} onChange={handleInputChange} onClick={() => handleFieldClick("whatsapp", whatsappRef)} ref={whatsappRef} />
        <input type="text" name="email" className="cadastro-full-input input-placeholder-white" placeholder="E-mail" value={formData.email} onChange={handleInputChange} onClick={() => handleFieldClick("email", emailRef)} ref={emailRef} />
      </div>

      <div className="campo-grupo">
        <label className="campo-titulo">Idade</label>
        <div className="campo-opcoes" style={{ justifyContent: "space-between" }}>
          {["até 16", "17 a 25", "26 a 35", "36 a 45", "46+"].map((idade) => (
            <label key={idade} className="campo-checkbox">
              <input type="checkbox" checked={formData.idadePerfil === idade} onChange={() => handleCheckboxChange("idadePerfil", idade)} />
              <span>{idade}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="campo-grupo">
        <label className="campo-titulo">Sexo</label>
        <div className="campo-opcoes" style={{ justifyContent: "space-between" }}>
          {["Feminino", "Masculino", "Não binário", "Não identificar"].map((sexo) => (
            <label key={sexo} className="campo-checkbox">
              <input type="checkbox" checked={formData.sexo === sexo} onChange={() => handleCheckboxChange("sexo", sexo)} />
              <span>{sexo}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="checkbox-correntista">
        <span style={{ color: "white", fontWeight: "bold", fontSize: "1.5vh" }}>Você já é cliente Bradesco?</span>
        <div className="checkbox-correntista-opcoes">
          <label>
            <input
              type="checkbox"
              name="correntista"
              checked={formData.correntista === true}
              onChange={() => handleCheckboxChange("correntista", true)}
            /> Sim
          </label>
          <label>
            <input
              type="checkbox"
              name="correntista"
              checked={formData.correntista === false}
              onChange={() => handleCheckboxChange("correntista", false)}
            /> Não
          </label>
        </div>
      </div>

      <div className="checkbox-lgpd">
        <input type="checkbox" name="lgpd" checked={formData.lgpd} onChange={(e) => handleCheckboxChange("lgpd", e.target.checked)} />
        Termo de responsabilidade e segurança de acordo com LGPD
      </div>
      <div className="cadastro-full-keyboard">
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
          display={{
            "{bksp}": "⌫",
            "{space}": "space",
            "{symbols}": "123",
            "{default}": "ABC"
          }}
          className="custom-bradesco-keyboard"
          layoutName={keyboardLayout}
          onKeyPress={(button) => {
            if (button === "{symbols}") setKeyboardLayout("symbols");
            if (button === "{default}") setKeyboardLayout("default");
          }}
        />
      </div>
      <button className="cadastro-full-button" onClick={() => handleCadastro(formData, callApi, navigate)} disabled={!isButtonEnabled}>
        CADASTRAR
      </button>
    </div>
  );
};

export default CadastroCompleto;