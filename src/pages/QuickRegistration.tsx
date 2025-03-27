import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "../styles/QuickRegistration.css";
import { validateCpf, formatCpf, unformatCpf } from "../utils/cpfUtils";
import { useApi } from "../hooks/useApi";
import useRfidApi from "../hooks/useRfidApi";
import Popup from "../components/Popup";

const CadastroRapido: React.FC = () => {
  const navigate = useNavigate();
  const { callApi, showPopup, popupMessage } = useApi();
  const { rfidValue } = useRfidApi();
  const [cpf, setCpf] = useState("");
  const [isCpfValid, setIsCpfValid] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false); // controla o teclado
  const cpfRef = useRef<HTMLInputElement | null>(null);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false); // Novo estado para o botão
  // Verifica se o RFID é válido e ativa o botão
  useEffect(() => {
    // O botão só será habilitado se o rfidValue estiver presente e for um código válido
    if (rfidValue ) {
      // Validação do formato do ExternalCode (exemplo)
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  }, [rfidValue]);
  const handleKeyboardChange = (input: string) => {
    setCpf(input);
    setIsCpfValid(validateCpf(input));
  };
  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/redirectscreen"); 
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = unformatCpf(e.target.value);
    setCpf(rawValue);
    setIsCpfValid(validateCpf(rawValue));
  };

  const handleCpfClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setCpf(unformatCpf(cpf));
    setShowKeyboard(true); // mostra o teclado ao clicar
    setTimeout(() => cpfRef.current?.focus(), 0);
  };

  const handleCadastro = async () => {
    const cpfSemFormatacao = unformatCpf(cpf);
    const organizerId = localStorage.getItem("OrganizerId");

    const payload = {
      Cpf: cpfSemFormatacao,
      ExternalCode: rfidValue,
      OrganizerId: organizerId ? parseInt(organizerId) : null,
    };

    localStorage.setItem("cpf", cpfSemFormatacao);
    const result = await callApi("//Person/SetExternalCode", "PUT", payload);

    if (result !== null) {
      navigate("/camera");
    }
  };

  return (
    <div className="cadastro-nfc-container">
      <Popup show={showPopup} message={popupMessage} />

      <h1 className="cadastro-nfc-title">Aproxime seu cartão da maquininha</h1>

      <h2 className="cadastro-nfc-subtitle">
        Digite seu CPF e<br />
        confirme seu cadastro.
      </h2>
      <style>
        {`
    .input-placeholder-white::placeholder {
      color: white; /* Define a cor do placeholder para branco */
    }
  `}
      </style>
      <label className="cadastro-nfc-label"></label>
      <input
        ref={cpfRef}
        type="text"
        className="cadastro-nfc-input input-placeholder-white"
        placeholder="CPF:"
        value={formatCpf(cpf)}
        onChange={handleCpfChange}
        onClick={handleCpfClick}
      />

      {showKeyboard && (
        <Keyboard
          onChange={handleKeyboardChange}
          layout={{
            default: ["1 2 3 4 5 6 7 8 9 0", "{bksp}"],
          }}
          display={{ "{bksp}": "Apagar" }}
          className="cadastro-nfc-keyboard"
          keyboardRef={(r) => {
            if (r?.keyboardDOM) {
              const keyboardDiv = r.keyboardDOM as HTMLDivElement;
              const style = keyboardDiv.style;
              style.position = "absolute";
              style.top = "66vh";
              style.left = "50%";
              style.transform = "translateX(-50%)";
              style.width = "200%";
              style.maxWidth = "400px";
              style.backgroundColor = "transparent";
              style.boxShadow = "none";
              style.border = "none";
            }
          }}
        />
      )}
      
     <button
  onClick={handleCadastro}
  disabled={!isCpfValid || !isButtonEnabled} // Habilita apenas se o CPF for válido e RFID for válido
  style={{
    backgroundColor: "#CD092F", // Cor vermelha escura
    color: "white", // Texto branco
    borderColor: "white", // Borda branca
    borderWidth: "4px", // Borda grossa
    borderStyle: "solid",
    borderRadius: "60px", // Bordas ainda mais arredondadas para parecer oval
    padding: "30px 90px", // AUMENTOU O TAMANHO DO BOTÃO
    fontSize: "2vh", // AUMENTOU O TAMANHO DO TEXTO
    fontWeight: "bold",
    height: "100px", // AUMENTOU A ALTURA DO BOTÃO
    fontFamily: "BradescoSansButtom",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "absolute",
    top: "60vh",
    left: "50%",
    transform: "translateX(-95%)",
    boxShadow: (!isCpfValid || !isButtonEnabled) ? "0 4px 8px rgba(1, 1, 1, 0.2)" : "none", // Sombra no botão desabilitado
    opacity: (!isCpfValid || !isButtonEnabled) ? 0.5 : 1, // Tornar o botão semitransparente quando desabilitado
  }}
>
  CONFIRMAR
</button>
<button
                className="confirm-button"
                onClick={handleBackClick}
                style={{
                  backgroundColor: "#CD092F", // Cor vermelha escura
    color: "white", // Texto branco
    borderColor: "white", // Borda branca
    borderWidth: "4px", // Borda grossa
    borderStyle: "solid",
    borderRadius: "60px", // Bordas ainda mais arredondadas para parecer oval
    padding: "30px 90px", // AUMENTOU O TAMANHO DO BOTÃO
    fontSize: "2vh", // AUMENTOU O TAMANHO DO TEXTO
    fontWeight: "bold",
    height: "100px", // AUMENTOU A ALTURA DO BOTÃO
    fontFamily: "BradescoSansButtom",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    position: "absolute",
    top: "59vh",
    left: "50%",
    transform: "translateX(10%)",
                }}
              >
                Voltar
              </button>

    </div>
  );
};

export default CadastroRapido;
