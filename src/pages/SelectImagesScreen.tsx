import React, { useState } from "react";
import "../styles/SelectImagesScreen.css";
import { images } from "../data/imageData";
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
  const image = [
    { id: 1, text: "POP", imageUrl: '/img/camera/escolher_tema.png'},
    { id: 2, text: "ROCK",imageUrl: '/img/camera/escolher_tema.png' },
    { id: 3, text: "MPB",imageUrl: '/img/camera/escolher_tema.png' },
    { id: 4, text: "EDM" ,imageUrl: '/img/camera/escolher_tema.png'},
  ];

  const handleContinueClick = async () => {
    if (selectedImage === null) return;

    const selected = images.find((image) => image.id === selectedImage);
    if (selected) {
      const localStorageValue =
        localStorage.getItem("Foto") || "valor-padrao.jpg";
      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${localStorageValue}`;
      const updatedPrompt = selected.prompt.replace("<>", s3Url);

      console.log(
        `Imagem ${selected.id} selecionada!\nPrompt: ${updatedPrompt}\nDownload: ${s3Url}`
      );

      setIsModalOpen(true);
      setProgress(0);
      setImageUrls([]);
      setErrorMessage(null);

      await sendS3Url(
        updatedPrompt,
        setProgress,
        setImageUrls,
        setErrorMessage
      );
    }
  };

  return (
    <div
      className="page-container"
      style={{
        backgroundImage: `url('/img/camera/escolher_tema.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        paddingTop: "4vh", // Adiciona um padding no topo da página
      }}
    >
      <h1
        className="mb-4 "
        style={{
          color: "white",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "90%", // Limita a largura do texto a 80% da tela
          fontSize: "3vh", // Ajusta o tamanho da fonte para 54px
          marginTop: "3vh", // Adiciona uma margem no topo do texto
        }}
      >
        Agora escolha o tema musical que você mais curte:
      </h1>

      <div className="">
      <div className="image-grid">
  {image.map((image) => (
    <button
      key={image.id}
      className={`bg-[#f3b8d6] image-container ${selectedImage === image.id ? "selected" : ""}`}
      onClick={() => setSelectedImage(image.id)}
      style={{
        backgroundColor: "#f3b8d6", // Cor de fundo
        width: "13vh",
        height: "13vh",
        fontFamily: "BradescoSansButtom", // Fonte personalizada
        margin: "0vh", // Margem
        display: "flex", // Habilita flexbox
        alignItems: "center", // Centraliza verticalmente
        justifyContent: "center", // Centraliza horizontalmente
        border: selectedImage === image.id ? "3px solid #2e00d8" : "none", // Borda azul se selecionado
        cursor: "pointer", // Muda o cursor para ponteiro
      }}
    >
      <img
        src={image.imageUrl} // Assume que `image.imageUrl` contém a URL da imagem
        alt={image.text} // Descrição da imagem para acessibilidade
        style={{
          width: "100%", // Ajusta a imagem para preencher o botão
          height: "100%", // Ajusta a altura da imagem
          objectFit: "cover", // Ajusta para cobrir o espaço sem distorcer
        }}
      />
    </button>
  ))}
</div>

</div>


      <button
    className="continue-button"
    disabled={selectedImage === null}
    onClick={handleContinueClick}
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
    Gerar foto
</button>

      {/* 
      <button className="continue-button" onClick={() => navigate("/camera")}
        style={{
          backgroundColor: "#cd092f", // Cor de fundo vermelha
          color: "white", // Texto branco
          borderColor: "white", // Borda branca
          borderWidth: "1px", // Largura da borda de 1px
          borderStyle: "solid", // Estilo da borda sólido
          borderRadius: "9999px", // Bordas completamente arredondadas
          padding: "12px 20px", // Aumenta o padding vertical para 12px e horizontal para 20px
          fontSize: "54px", // Ajuste opcional para tamanho da fonte
          fontWeight: "bold", // Define a fonte como negrito
          height: "50px", // Define a altura do botão para 50px
          fontFamily: 'BradescoSans', // Aplica a fonte personalizada
        }}>
        Voltar
      </button> */}

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
