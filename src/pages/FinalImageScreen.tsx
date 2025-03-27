import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";

import "../styles/FinalImageScreen.css";

const BUCKET_NAME = "bucket-bradesco-lollapalloza";
const REGION = "sa-east-1";

const FinalImageScreen: React.FC = () => {
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false); // Estado para indicar que a espera de 5 segundos acabou
  const navigate = useNavigate();

  useEffect(() => {
    const processedFoto = localStorage.getItem("ProcessedFoto");
    if (!processedFoto) {
      console.error("⚠️ Nenhuma imagem processada encontrada!");
      navigate("/roleta");
      return;
    }

    // Monta a URL correta do S3
    const s3Url = `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${processedFoto}`;
    console.log("📥 Buscando imagem do S3:", s3Url);
    setFinalImageUrl(s3Url);
    // Espera 5 segundos antes de permitir a navegação
    const timer = setTimeout(() => {
      setIsReady(true); // Após 5 segundos, define o estado como pronto para navegação
    }, 3000);

    // Limpeza do temporizador
    return () => clearTimeout(timer);
  }, [navigate]);
  const handleClick = () => {
    if (isReady) {
      navigate("/roleta"); // Redireciona para a roleta quando o usuário clicar
    }
  };
  // Função para lidar com o clique do botão de voltar
const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.stopPropagation(); // Impede que o evento clique se propague para o container
  navigate("/camera"); // Navega para a página de câmera
};

  return (
    <div
      className="final-image-container"
      style={{
        backgroundImage: `url('/img/camera/final.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "4vh", // Adiciona um padding no topo da página
      }}
      onClick={handleClick}
    >
      <h1
        style={{
          color: "white",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "90%", // Limita a largura do texto a 80% da tela
          fontSize: "3vh", // Ajusta o tamanho da fonte para 54px
          marginBottom: "70px",
          marginTop: "5vh",
        }}
      >
        {" "}
        Pronto !
      </h1>
      <h1
        style={{
          color: "white",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "90%", // Limita a largura do texto a 80% da tela
          fontSize: "3vh", // Ajusta o tamanho da fonte para 54px
          marginBottom: "60px",
        }}
      >
        Agora é só salvar a foto escaneando o QR Code
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {finalImageUrl ? (
          <>
            <img
              src={finalImageUrl}
              alt="Imagem final"
              className="final-image"
              style={{ maxWidth: "50%" }}
            />
            <div className="qr-code-container">
              <QRCodeSVG
                value={finalImageUrl}
                className="qr-code"
                style={{ scale: 0.7 }}
                bgColor="transparent" // Define o fundo do QR Code como transparente
                fgColor="#ffffff" // Cor dos pixels do QR Code branca
              />
            </div>
          </>
        ) : (
          <p>⏳ Carregando imagem...</p>
        )}
      </div>
      <h1
        style={{
          color: "white",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "90%", // Limita a largura do texto a 80% da tela
          fontSize: "3vh", // Ajusta o tamanho da fonte para 54px
          marginTop: "20px",
        }}
      >
        Poste sua foto nas redes sociais usando a{" "}
        <span style={{ fontStyle: "italic" }}>#BradescoNoLollaBr</span> e marque
        o @bradesco
      </h1>
      <button
              className="confirm-button"
              onClick={handleBackClick} // Use a nova função para tratar o evento de clique
             
              style={{
                backgroundColor: "#cd092f",
                color: "white",
                borderColor: "white",
                borderWidth: "4px",
                borderStyle: "solid",
                borderRadius: "9999px",
                padding: "18px 20px",
                fontSize: "2vh",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                height: "100px",
                fontFamily: "BradescoSansButtom",
                width: "20vh",
                
                
              }}
            >
              Voltar
            </button>
    </div>
  );
};

export default FinalImageScreen;
