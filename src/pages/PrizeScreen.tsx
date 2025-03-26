import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { prizesRoleta, prizesLoudge, prizeDescriptions } from "../data/prizes"; // Importe as listas de prêmios
import "../styles/PrizeScreen.css";

const PrizeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { prizeName } = useParams<{ prizeName?: string }>(); // Pega o nome do prêmio da URL
  const decodedPrizeName = decodeURIComponent(prizeName || ""); // Decodifica o nome do prêmio
  let prize = null;

  // Verifica o tipo de organizador para escolher a lista de prêmios correta
  const organizerName = localStorage.getItem("OrganizerName");
  const prizeList =
    organizerName && organizerName.toLowerCase().includes("roleta")
      ? prizesRoleta
      : prizesLoudge;

  // Encontra o prêmio com base no nome decodificado
  prize = prizeList.find((prizeItem) => prizeItem.name === decodedPrizeName);
  // Busca a descrição do prêmio
  const description =
    decodedPrizeName in prizeDescriptions
      ? prizeDescriptions[decodedPrizeName as keyof typeof prizeDescriptions]
      : "Descrição não disponível.";

  if (!prize) {
    return (
      <div
        className="prize-container"
        style={{
          backgroundImage: `url('/img/roleta/fundo_premio.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1
          style={{
            color: "white",
            fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
            maxWidth: "90%", // Define a largura máxima do texto
            margin: "0px auto 0 auto", // Margem superior negativa para subir o texto
            fontSize: "4vh", // Ajusta o tamanho da fonte para 54px
            // border:"solid 9px yellow",
            marginTop: "18vh", // Ajuste fino para centralizar a imagem
          }}
        >
          Brinde não encontrado
        </h1>
        <button
          onClick={() => navigate("/redirectscreen")}
          style={{
            backgroundColor: "#cd092f", // Cor de fundo vermelha
            color: "white", // Texto branco
            borderColor: "white", // Borda branca
            borderWidth: "2px", // Largura da borda de 1px
            borderStyle: "solid", // Estilo da borda sólido
            borderRadius: "9999px", // Bordas completamente arredondadas
            padding: "4px 42px", // Aumento do padding vertical para 20px e horizontal para 30px
            fontSize: "3vh", // Tamanho da fonte
            fontWeight: "bold", // Fonte negrito
            height: "5vh", // Aumento da altura do botão para 100px para acomodar o tamanho da fonte
            fontFamily: "BradescoSansButtom", // Fonte personalizada para todo o botão
            marginTop: "3vh", // Ajuste fino para centralizar a imagem
            zIndex: 10, // Coloca o botão na frente da roleta
          }}
        >
          Sair
        </button>
      </div>
    );
  }
  if (prize.name === "Não Foi dessa Vez") {
    return (
      <div className="prize-container"  style={{
        backgroundImage: `url('/img/roleta/fundo_sempontos.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // border:"solid 9px yellow",
      }}>
      
  
        {/* Título principal */}
        <h1 className="prize-title"  style={{
          color: "#cd092f",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "90%", // Define a largura máxima do texto
         
          fontSize: "4vh", // Ajusta o tamanho da fonte para 54px
          // border:"solid 9px yellow",
          marginTop: "35vh", // Ajuste fino para centralizar a imagem
        }} >Não foi dessa vez!</h1>
  
        {/* Conteúdo principal */}
        <div className="prize-content"  style={{
          color: "#cd092f",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "100%", // Define a largura máxima do texto
         
          fontSize: "4vh", // Ajusta o tamanho da fonte para 54px
         
        }}>
          <p >Mas não desanime,</p>
          <p>retire seu</p>
          <p>brinde especial! 😉</p>
  
          <button className="prize-button" onClick={() => navigate("/redirectscreen")}
             style={{
              backgroundColor: "#cd092f", // Cor de fundo vermelha
              color: "white", // Texto branco
              borderColor: "white", // Borda branca
              borderWidth: "2px", // Largura da borda de 1px
              borderStyle: "solid", // Estilo da borda sólido
              borderRadius: "9999px", // Bordas completamente arredondadas
              padding: "4px 42px", // Aumento do padding vertical para 20px e horizontal para 30px
              fontSize: "3vh", // Tamanho da fonte
              fontWeight: "bold", // Fonte negrito
              height: "5vh", // Aumento da altura do botão para 100px para acomodar o tamanho da fonte
              fontFamily: "BradescoSansButtom", // Fonte personalizada para todo o botão
              marginTop: "1vh", // Ajuste fino para centralizar a imagem
              zIndex: 10, // Coloca o botão na frente da roleta
            }}>Finalizar</button>
        </div>
  
       
      </div>
    );
  }
  
  return (
    <div
      className="prize-container"
      style={{
        backgroundImage: `url('/img/roleta/fundo_premio.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        // border:"solid 9px yellow",
      }}
    >
      <h1
        style={{
          color: "white",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "90%", // Define a largura máxima do texto
          margin: "0px auto 0 auto", // Margem superior negativa para subir o texto
          fontSize: "4vh", // Ajusta o tamanho da fonte para 54px
          // border:"solid 9px yellow",
          marginTop: "18vh", // Ajuste fino para centralizar a imagem
        }}
      >
        <img
          src="/img/roleta/hands.png" // Substitua pelo caminho do seu emoji
          style={{
            width: "5vh", // Ajuste o tamanho da imagem
            height: "auto", // Mantém a proporção da imagem
            marginRight: "10px", // Espaço entre a imagem e a palavra "Parabéns"
            marginBottom: "1vh", // Ajuste fino para centralizar a imagem
          }}
        />
        Parabéns!
      </h1>

      <h1
        style={{
          color: "white",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "90%", // Define a largura máxima do texto
          fontSize: "3vh", // Ajusta o tamanho da fonte para 54px
          // border:"solid 9px yellow",
        }}
      >
        {description}
      </h1>
      <img src={prize.image} alt={prize.name} className="prize-image" />
      <h1
        style={{
          color: "white",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "90%", // Define a largura máxima do texto
          margin: "0px auto 0 auto", // Margem superior negativa para subir o texto
          fontSize: "3vh", // Ajusta o tamanho da fonte para 54px
        }}
      >
        e +10 pontos para retirar um{" "}
        <span
          style={{
            fontFamily: "BradescoSansButtom",
            fontSize: "4vh",
            fontWeight: "bold",
          }}
        >
          ACQUA DRINK
        </span>{" "}
        <img
          src="/img/roleta/love.png" // Substitua pelo caminho do seu emoji
          style={{
            width: "5vh", // Ajuste o tamanho da imagem
            height: "auto", // Mantém a proporção da imagem
            marginRight: "10px", // Espaço entre a imagem e a palavra "Parabéns"
          }}
        />
      </h1>

      <button
        onClick={() => navigate("/finalscreen")}
        style={{
          backgroundColor: "#cd092f", // Cor de fundo vermelha
          color: "white", // Texto branco
          borderColor: "white", // Borda branca
          borderWidth: "2px", // Largura da borda de 1px
          borderStyle: "solid", // Estilo da borda sólido
          borderRadius: "9999px", // Bordas completamente arredondadas
          padding: "4px 42px", // Aumento do padding vertical para 20px e horizontal para 30px
          fontSize: "3vh", // Tamanho da fonte
          fontWeight: "bold", // Fonte negrito
          height: "5vh", // Aumento da altura do botão para 100px para acomodar o tamanho da fonte
          fontFamily: "BradescoSansButtom", // Fonte personalizada para todo o botão
          marginTop: "1vh", // Ajuste fino para centralizar a imagem
          zIndex: 10, // Coloca o botão na frente da roleta
        }}
      >
        FINALIZAR
      </button>
    </div>
  );
};

export default PrizeScreen;
