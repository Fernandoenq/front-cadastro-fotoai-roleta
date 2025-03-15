import React, { useState } from "react";
import "../styles/SelectImagesScreen.css";
import { images } from "../data/imageData"; 
import logo from "../assets/logo.png"; 
import useFotoAiAPI from "../hooks/fotoAiAPI";
import ProgressModal from "../modals/ProgressModal";
import { useNavigate } from "react-router-dom";

const bucketName = "bucket-bradesco-lollapalloza";
const region = "sa-east-1";

const SelectImageScreen: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const { sendS3Url } = useFotoAiAPI();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [progress, setProgress] = useState<number | string>(0); // ✅ Agora aceita string e número
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleContinueClick = async () => {
    if (selectedImage === null) return;

    const selected = images.find((image) => image.id === selectedImage);
    if (selected) {
      const localStorageValue = localStorage.getItem("Foto") || "valor-padrao.jpg";
      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${localStorageValue}`;
      const updatedPrompt = selected.prompt.replace("<>", s3Url);

      console.log(`Imagem ${selected.id} selecionada!\nPrompt: ${updatedPrompt}\nDownload: ${s3Url}`);

      setIsModalOpen(true);
      setProgress(0);
      setImageUrls([]);
      setErrorMessage(null);

      await sendS3Url(updatedPrompt, setProgress, setImageUrls, setErrorMessage);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Selecione uma opção</h1>
      <img src={logo} alt="Logo" className="logo" />

      <div className="image-box">
        <div className="image-grid">
          {images.map((image) => (
            <div
              key={image.id}
              className={`image-container ${selectedImage === image.id ? "selected" : ""}`}
              onClick={() => setSelectedImage(image.id)}
            >
              <img src={image.src} alt={image.label} className="image" />
              <p className="image-label">{image.label}</p>
            </div>
          ))}
        </div>
      </div>

      <button className="continue-button" disabled={selectedImage === null} onClick={handleContinueClick}>
        Continuar
      </button>

      <button className="continue-button" onClick={() => navigate("/camera")}>Voltar</button>

      <ProgressModal 
        isOpen={isModalOpen} 
        progress={progress} 
        imageUrls={imageUrls} 
        errorMessage={errorMessage} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default SelectImageScreen;
