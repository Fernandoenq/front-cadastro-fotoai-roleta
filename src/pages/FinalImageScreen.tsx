import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import maskImage from "../assets/mask.png"; // Caminho da máscara
import "../styles/FinalImageScreen.css";

const FinalImageScreen: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const selectedImage = localStorage.getItem("Foto"); // Obtém a imagem do localStorage
    if (!selectedImage) {
      console.error("⚠️ Nenhuma imagem selecionada encontrada!");
      navigate("/"); // Redireciona para a tela inicial se não houver imagem
      return;
    }

    const mergeImages = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const image = new Image();
      image.crossOrigin = "Anonymous";
      image.src = selectedImage;

      const mask = new Image();
      mask.crossOrigin = "Anonymous";
      mask.src = maskImage;

      image.onload = () => {
        mask.onload = () => {
          console.log("✅ Imagem e máscara carregadas!");

          const aspectRatio = 9 / 16;
          const maxWidth = 720; // Largura fixa
          const maxHeight = maxWidth * aspectRatio; // Altura proporcional

          canvas.width = maxWidth;
          canvas.height = maxHeight;

          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
          ctx.drawImage(mask, 0, 0, canvas.width, canvas.height);

          const mergedImage = canvas.toDataURL("image/png");
          setFinalImage(mergedImage);
        };
      };

      image.onerror = () => console.error("❌ Erro ao carregar a imagem selecionada.");
      mask.onerror = () => console.error("❌ Erro ao carregar a máscara.");
    };

    mergeImages();
  }, [navigate]);

  return (
    <div className="final-image-container">
      <h1>Imagem Final</h1>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {finalImage ? (
        <img src={finalImage} alt="Imagem final" className="final-image" />
      ) : (
        <p>⏳ Carregando imagem...</p>
      )}
      <button onClick={() => navigate("/")}>Voltar</button>
    </div>
  );
};

export default FinalImageScreen;
