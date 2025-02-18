import React, { useState } from "react";
import "../styles/SelectImagesScreen.css";
import { images, ImageItem } from "../data/imageData"; 
import logo from "../assets/logo.png"; 

const bucketName = "bucket-bradesco-lollapalloza"; // Substitua pelo nome do seu bucket
const region = "sa-east-1"; // Substitua pela região do S3 (ex: sa-east-1 para Brasil)

const SelectImageScreen: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleContinueClick = () => {
    if (selectedImage === null) return;

    const selected = images.find((image) => image.id === selectedImage);
    if (selected) {
      const localStorageValue = localStorage.getItem("Foto") || "valor-padrao.jpg"; // Obtém o nome do arquivo do localStorage

      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${localStorageValue}`; // Gera o link de download do S3


      const updatedPrompt = selected.prompt.replace("<>", s3Url); // Substitui <> pelo valor do localStorage


      alert(`Imagem ${selected.id} selecionada!\nPrompt: ${updatedPrompt}`);
      console.log(`Imagem ${selected.id} selecionada!\nPrompt: ${updatedPrompt}\nDownload: ${s3Url}`);

      // Opcional: Abrir o link em uma nova aba
      window.open(s3Url, "_blank");
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Selecione uma opção</h1>
      <img src={logo} alt="Logo" className="logo" />

      <div className="image-box">
        <div className="image-grid">
          {images.map((image: ImageItem) => (
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
    </div>
  );
};

export default SelectImageScreen;
