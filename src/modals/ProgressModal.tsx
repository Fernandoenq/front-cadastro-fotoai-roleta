import React, { useState } from "react";
import "../styles/ProgressModal.css";
import { useApi } from '../hooks/useApi';
import useFotoAiAPI from '../hooks/fotoAiAPI';
import { useNavigate } from "react-router-dom";

interface ProgressModalProps {
  isOpen: boolean;
  progress: number | string;
  imageUrls: string[];
  onClose: () => void;
  errorMessage: string | null;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, progress, imageUrls, onClose, errorMessage }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { callApi } = useApi();
  const { sendImageName } = useFotoAiAPI();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedImage) return;
    setIsSubmitting(true);

    try {
      let cpf = localStorage.getItem("cpf") || "";
      if (!cpf) {
        console.error("⚠️ CPF não encontrado no localStorage!");
        return;
      }

      const response = await callApi("/Image/SaveImage", "POST", { imageName: selectedImage, cpf });

      if (response?.ImageName) {
        console.log("✅ Nome da imagem recebido:", response.ImageName);
        localStorage.setItem("Foto", response.ImageName);

        const newImageName = await sendImageName(response.ImageName, cpf);
        if (newImageName) {
          console.log("✅ Novo nome da imagem processada recebido:", newImageName);
          localStorage.setItem("ProcessedFoto", newImageName);
        }

        navigate("/finalimage");
      } else {
        console.error("❌ Erro ao receber nome da imagem.");
      }
    } catch (error) {
      console.error("❌ Erro ao enviar imagem:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Gerando Imagens...</h2>

        {errorMessage ? (
          <>
            <p style={{ color: "red" }}>{errorMessage}</p>
            <button className="close-button" onClick={onClose}>Fechar</button>
          </>
        ) : imageUrls.length === 0 ? (
          typeof progress === "number" ? (
            <>
              <p>Progresso: {progress}%</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </>
          ) : null
        ) : (
          <>
            <h3>Selecione uma imagem</h3>
            <div className="image-grid">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className={`image-container ${selectedImage === url ? "selected" : ""}`}
                  onClick={() => setSelectedImage(url)}
                >
                  <img src={url} alt={`Gerada ${index + 1}`} className="generated-image" />
                </div>
              ))}
            </div>

            <button className="confirm-button" onClick={handleConfirm} disabled={!selectedImage || isSubmitting}>
              {isSubmitting ? "Enviando..." : "Confirmar"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressModal;
