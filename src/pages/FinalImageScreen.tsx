import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react"; 

import "../styles/FinalImageScreen.css";

const BUCKET_NAME = "bucket-bradesco-lollapalloza"; 
const REGION = "sa-east-1"; 

const FinalImageScreen: React.FC = () => {
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processedFoto = localStorage.getItem("ProcessedFoto"); 
    if (!processedFoto) {
      console.error("⚠️ Nenhuma imagem processada encontrada!");
      //navigate("/roleta");
      return;
    }

    // Monta a URL correta do S3
    const s3Url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${processedFoto}`;
    console.log("📥 Buscando imagem do S3:", s3Url);
    setFinalImageUrl(s3Url);
  }, [navigate]);

  return (
    <div className="final-image-container">
      <h1>Imagem Final</h1>

      {finalImageUrl ? (
        <>
          <img src={finalImageUrl} alt="Imagem final" className="final-image" />
          <QRCodeSVG value={finalImageUrl} className="qr-code" /> 
        </>
      ) : (
        <p>⏳ Carregando imagem...</p>
      )}

      <button onClick={() => navigate("/roleta")}>Ir para a Roleta</button>
    </div>
  );
};

export default FinalImageScreen;
