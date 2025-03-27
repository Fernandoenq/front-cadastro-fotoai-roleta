import React, { useState } from "react";
import "../styles/ProgressModal.css";
import { useApi } from "../hooks/useApi";
import useFotoAiAPI from "../hooks/fotoAiAPI";
import { useNavigate } from "react-router-dom";

interface ProgressModalProps {
  isOpen: boolean;
  progress: number | string;
  imageUrls: string[];
  onClose: () => void;
  errorMessage: string | null;
}

const ProgressModal: React.FC<ProgressModalProps> = ({
  isOpen,
  progress,
  imageUrls,
  onClose,
  errorMessage,
}) => {
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

      // Converte a URL da imagem em um arquivo Blob
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: "image/png" });

      // Criar FormData (igual ao Postman)
      const formData = new FormData();
      formData.append("file", file); // Adiciona a imagem como arquivo
      formData.append("cpf", cpf); // Adiciona o CPF como texto

      console.log("📤 Enviando arquivo e CPF:", formData);

      // Chamar a API com FormData
      const apiResponse = await callApi("/Image/SaveImage", "POST", formData);

      if (apiResponse?.ImageName) {
        console.log("✅ Nome da imagem recebido:", apiResponse.ImageName);
        localStorage.setItem("Foto", apiResponse.ImageName);

        const newImageName = await sendImageName(apiResponse.ImageName, cpf);
        if (newImageName) {
          console.log(
            "✅ Novo nome da imagem processada recebido:",
            newImageName
          );
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
    <div
      className="modal-overlay"
      style={{
        backgroundImage: `url('/img/camera/escolher_foto.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "4vh", // Adiciona um padding no topo da página
      }}
    >
      <div className="modal-content" >
        {errorMessage ? (
          <>
            <p style={{ color: "#cd092f", fontFamily: 'BradescoSans',fontSize: "40px",paddingLeft:'15px' , paddingRight:'15px' }}>{errorMessage}</p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <button className="close-button" onClick={onClose} style={{
                backgroundColor: "#cd092f", // Cor de fundo vermelha
                color: "white", // Texto branco
                borderColor: "white", // Borda branca
                borderWidth: "1px", // Largura da borda de 1px
                borderStyle: "solid", // Estilo da borda sólido
                borderRadius: "9999px", // Bordas completamente arredondadas
                padding: "4px 42px", // Aumento do padding vertical para 20px e horizontal para 30px
                fontSize: "40px", // Tamanho da fonte
                fontWeight: "bold", // Fonte negrito
                height: "100px", // Aumento da altura do botão para 100px para acomodar o tamanho da fonte
                fontFamily: "BradescoSansButtom", // Fonte personalizada
                width: "20vh", // Ajusta a largura automaticamente baseado no conteúdo e padding
              }}>
                Fechar
              </button>
            </div>
          </>
        ) : imageUrls.length === 0 ? (
          typeof progress === "number" ? (
            <>
             <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    width: '100%'  // Garante que o contêiner tome a largura total
  }}>
             <h2 style={{ color: "#cd092f", fontFamily: 'BradescoSansBold',  fontSize: "40px",}}>Gerando Imagens...</h2>
              <p style={{ color: "#cd092f", fontFamily: 'BradescoSans'}}>Progresso: {progress}%</p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <button
              className="confirm-button"
              onClick={onClose}  // Navega para a página anterior
             
              style={{
                backgroundColor: "#cd092f", // Cor de fundo vermelha
                color: "white", // Texto branco
                borderColor: "white", // Borda branca
                borderWidth: "1px", // Largura da borda de 1px
                borderStyle: "solid", // Estilo da borda sólido
                borderRadius: "9999px", // Bordas completamente arredondadas
                padding: "4px 42px ", // Aumento do padding vertical para 20px e horizontal para 30px
                fontSize: "3vh", // Tamanho da fonte
                fontWeight: "bold", // Fonte negrito
                height: "5vh", // Aumento da altura do botão para 100px para acomodar o tamanho da fonte
                fontFamily: "BradescoSansButtom", // Fonte personalizada
                
              }}
            >
              Voltar
            </button>
            </div>
            </>
          ) : null
        ) : (
          <>
            <h3
              style={{
                fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
                maxWidth: "100%", // Limita a largura do texto a 80% da tela
                fontSize: "3vh", // Ajusta o tamanho da fonte para 54px
                color: "#cd092f",
              }}
            >
              Selecione a foto que você mais curtiu
            </h3>
            <div className="image-grid">
              {imageUrls.map((url, index) => (
                <div
                  key={index}
                  className={`image-container ${
                    selectedImage === url ? "selected" : ""
                  }`}
                  onClick={() => setSelectedImage(url)}
                >
                  <img
                    src={url}
                    alt={`Gerada ${index + 1}`}
                    className="generated-image"
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' , gap:'1vh'}}>
            <button
              className="confirm-button"
              onClick={handleConfirm}
              disabled={!selectedImage || isSubmitting}
              style={{
                backgroundColor: "#cd092f", // Cor de fundo vermelha
                color: "white", // Texto branco
                borderColor: "white", // Borda branca
                borderWidth: "4px", // Largura da borda de 1px
                borderStyle: "solid", // Estilo da borda sólido
                borderRadius: "9999px", // Bordas completamente arredondadas
                padding: "18px 20px", // Aumenta o padding vertical para 12px e horizontal para 20px
                fontSize: "2vh", // Ajuste para tamanho da fonte mais típico
                fontWeight: "bold", // Define a fonte como negrito
                display: "flex", // Usa Flexbox para alinhar o conteúdo
                justifyContent: "center", // Centraliza o conteúdo horizontalmente no Flexbox
                alignItems: "center", // Centraliza o conteúdo verticalmente no Flexbox
              
                textAlign: "center", // Garante que o texto esteja centralizado horizontalmente
                height: "100px", // Aumento da altura do botão para 100px para acomodar o tamanho da fonte
                fontFamily: "BradescoSansButtom", // Fonte personalizada
                width: "20vh", // Ajusta a largura automaticamente baseado no conteúdo e padding
              }}
            >
              {isSubmitting ? "Enviando..." : "Confirmar"}
            </button>
            <button
              className="confirm-button"
              onClick={onClose}  // Navega para a página anterior
             
              style={{
                backgroundColor: "#cd092f", // Cor de fundo vermelha
                color: "white", // Texto branco
                borderColor: "white", // Borda branca
                borderWidth: "4px", // Largura da borda de 1px
                borderStyle: "solid", // Estilo da borda sólido
                borderRadius: "9999px", // Bordas completamente arredondadas
                padding: "18px 20px", // Aumenta o padding vertical para 12px e horizontal para 20px
                fontSize: "2vh", // Ajuste para tamanho da fonte mais típico
                fontWeight: "bold", // Define a fonte como negrito
                display: "flex", // Usa Flexbox para alinhar o conteúdo
                justifyContent: "center", // Centraliza o conteúdo horizontalmente no Flexbox
                alignItems: "center", // Centraliza o conteúdo verticalmente no Flexbox
              
                textAlign: "center", // Garante que o texto esteja centralizado horizontalmente
                height: "100px", // Aumento da altura do botão para 100px para acomodar o tamanho da fonte
                fontFamily: "BradescoSansButtom", // Fonte personalizada
                width: "20vh", // Ajusta a largura automaticamente baseado no conteúdo e padding
                
              }}
            >
              Voltar
            </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProgressModal;
