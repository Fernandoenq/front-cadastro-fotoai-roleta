import React, { useState } from "react";
import "../styles/ProgressModal.css";
import { useApi } from '../hooks/useApi'; // Importa a função da API
import { useNavigate } from "react-router-dom"; // ✅ Importa o hook de navegação
import useFotoAiAPI from '../hooks/fotoAiAPI'

interface ProgressModalProps {
  isOpen: boolean;
  progress: number;
  imageUrls: string[];
  onClose: () => void;
  errorMessage: string | null;
}

const ProgressModal: React.FC<ProgressModalProps> = ({ isOpen, progress, imageUrls, onClose, errorMessage }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { callApi } = useApi();
  const navigate = useNavigate(); 
  const { sendImageName } = useFotoAiAPI(); // ✅ Novo hook para enviar o nome da imagem

  if (!isOpen) return null;

  const convertImageToBlob = async (imageUrl: string): Promise<Blob | null> => {
    try {
      console.log("📸 Convertendo imagem para Base64:", imageUrl);

      // Baixa a imagem como um Blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Converte Blob para Base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
      });

      console.log("✅ Imagem convertida para Base64!");

      // Converte Base64 de volta para Blob
      const byteCharacters = atob(base64.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: "image/png" });
    } catch (error) {
      console.error("❌ Erro ao converter imagem:", error);
      return null;
    }
  };

  const handleConfirm = async () => {
    if (!selectedImage) return;
    setIsSubmitting(true);

    try {
      const blob = await convertImageToBlob(selectedImage);
      if (!blob) throw new Error("Erro ao converter a imagem.");

      let cpf = localStorage.getItem("cpf") || "";
      if (!cpf) {
        console.error("⚠️ CPF não encontrado no localStorage!");
        return;
      }

      const formData = new FormData();
      formData.append("file", blob, "selected-image.png");
      formData.append("cpf", cpf); // ✅ Adicionando CPF ao envio

      const response = await callApi("/Image/SaveImage", "POST", formData);

      if (response?.ImageName) {
        console.log("✅ Nome da imagem recebido:", response.ImageName);
        localStorage.setItem("Foto", response.ImageName);

        // ✅ Agora enviamos o nome da imagem junto com o CPF para o Flask
        sendImageName(response.ImageName, cpf);

        window.open("/finalimage");
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
          <>
            <p>Progresso: {progress}%</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </>
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
