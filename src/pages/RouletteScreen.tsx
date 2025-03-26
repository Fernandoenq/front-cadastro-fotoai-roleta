import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RouletteScreen.css";
import { prizesRoleta, prizesLoudge } from "../data/prizes"; // Importe as listas de prêmios
import pointer from "../assets/pointer.png";
import wheel from "../assets/wheel.png";
import useFetchPrize from "../hooks/useFetchPrize";
import image7b from "/img/roleta/roleta7b.png";
import image7c from "/img/roleta/roleta7c.png";

const RoletaScreen: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();
  const { fetchPrize, loading } = useFetchPrize();
  const organizerName = localStorage.getItem("OrganizerName"); // Pega o OrganizerName do localStorage

  // Determina qual imagem usar com base na presença da palavra no nome do organizador
  const imageToShow =
    organizerName && organizerName.toLowerCase().includes("roleta")
      ? image7b
      : organizerName && organizerName.toLowerCase().includes("lounge")
      ? image7c
      : wheel;

      const spinWheel = async () => {
        console.log("🎰 Girando a roleta...");
        if (isSpinning) return; // Garante que a função não seja chamada quando já estiver girando
    
        setIsSpinning(true); // Começa o giro da roleta
        setRotation(0); // Reseta a rotação da roleta
    
        const prize = await fetchPrize();
        console.log(prize)
       
        if (!prize) {
            console.error("❌ Nenhum prêmio retornado!");
            setIsSpinning(false); // Finaliza o giro caso não haja prêmio
            return;
        }
    
        // Seleciona a lista de prêmios com base no organizador
        const prizeList =
            organizerName && organizerName.toLowerCase().includes("roleta")
                ? prizesRoleta
                : prizesLoudge;
        console.log(prizeList);
    
        // Encontrar o índice do prêmio com base no GiftId
        console.log(prize.GiftId)
        const prizeIndex = prizeList.findIndex(
          (prizeItem) => prizeItem.id === Number(prize) // Converte prize.GiftId para número
        );
        
    
        if (prizeIndex === -1) {
            console.error("❌ Prêmio não encontrado na lista!");
            setIsSpinning(false);
            return;
        }
    
        console.log(`Índice do prêmio: ${prizeIndex}`);
       
    
        // Calcular o ângulo para o prêmio sorteado
        const anglePerPrize = 360 / prizeList.length; // Divide a roleta igualmente entre os prêmios
        const prizeAngle = prizeIndex * anglePerPrize + anglePerPrize / 2; // Meio do prêmio
    
        // Número de voltas extras
        const extraRotations = 5; // O número de voltas que a roleta deve fazer antes de parar
        const targetRotation = 360 * extraRotations + prizeAngle; // Gira 5 voltas completas + o ângulo do prêmio
    
        setRotation(targetRotation); // Atualiza a rotação da roleta
    
        setTimeout(() => {
            setIsSpinning(false); // Finaliza o giro após 5 segundos
            console.log(`🎁 O ponteiro parou em: ${prize.GiftName}`);
            navigate(`/roleta/${encodeURIComponent(prize.GiftName)}`); // Redireciona após o giro
        }, 5000); // A roleta gira por 5 segundos
    };
    
      

  return (
    <div
      className="roleta-container"
      style={{
        backgroundImage: `url('/img/roleta/fundo_roleta.png')`,
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

          marginTop: "13vh", // Adiciona uma margem no topo do texto
          marginBottom: "1.5vh",
        }}
      >
        Bora testar a sua sorte?
      </h1>

      <div className="roleta-wrapper">
        <img
          src={imageToShow} // Usa a imagem com base no OrganizerName
          alt="Roleta"
          className="roleta"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 3s ease-out" : "none",
            width: "80vh",
            height: "45vh",
            // border:"solid 9px yellow"
          }}
        />
        <img src={pointer} alt="Ponteiro" className="pointer" />
      </div>

      {/* <button className="roleta-button" onClick={() => navigate("/redirectscreen")}>
        Sair
      </button> */}

      <button
        onClick={spinWheel}
        disabled={isSpinning || loading}
        className="roleta-button"
        style={{
          backgroundColor: "#cd092f", // Cor de fundo vermelha
          color: "white", // Texto branco
          borderColor: "white", // Borda branca
          borderWidth: "1px", // Largura da borda de 1px
          borderStyle: "solid", // Estilo da borda sólido
          borderRadius: "9999px", // Bordas completamente arredondadas
          padding: "4px 42px", // Aumento do padding vertical para 20px e horizontal para 30px
          fontSize: "2vh", // Tamanho da fonte
          fontWeight: "bold", // Fonte negrito
          height: "5vh", // Aumento da altura do botão para 100px para acomodar o tamanho da fonte
          fontFamily: "BradescoSans", // Fonte personalizada para todo o botão
          transform: "translateY(-14vh)", // Move o botão para baixo
          zIndex: 10, // Coloca o botão na frente da roleta
        }}
      >
        {isSpinning ? (
          "Girando..."
        ) : loading ? (
          "Buscando prêmio..."
        ) : (
          <>
            GIRE A{" "}
            <span style={{ fontFamily: "BradescoSansButtom" }}>ROLETA</span>
          </>
        )}
      </button>
    </div>
  );
};

export default RoletaScreen;
