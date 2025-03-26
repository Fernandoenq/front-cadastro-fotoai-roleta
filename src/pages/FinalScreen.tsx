import React from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { useFetchBalanceByCpf } from "../hooks/useFetchBalanceByCpf";
import "../styles/FinalScreen.css";

const FinalScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const cpf = localStorage.getItem("cpf") || "";
  const { balanceCurrentValue, userName, loading, error } = useFetchBalanceByCpf(cpf);

  const randomQRCodeURL = "https://bradesco.picbrand.dev.br/login";

  return (
    <div className="final-container" style={{
      backgroundImage: `url('/img/roleta/fundo_roleta.png')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      // border:"solid 9px yellow",
    }}>
      <h1  style={{
          color: "white",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "90%", // Define a largura máxima do texto
         marginTop:'8vh',
          fontSize: "4vh", // Ajusta o tamanho da fonte para 54px
          // border:"solid 9px yellow",
          
        }}>Obrigado por ter participado</h1>
      <p  style={{
          color: "white",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "90%", // Define a largura máxima do texto
         marginTop:'1vh',
          fontSize: "2svh", // Ajusta o tamanho da fonte para 54px
          // border:"solid 9px yellow",
          
        }}>Parabéns {userName || "usuário"}</p>

      <div className="saldo">
        {loading ? (
          <span  style={{
            color: "white",
            fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
            maxWidth: "90%", // Define a largura máxima do texto
           marginTop:'5vh',
            fontSize: "4vh", // Ajusta o tamanho da fonte para 54px
            // border:"solid 9px yellow",
            
          }}>Carregando...</span>
        ) : error ? (
          <span className="text-danger">{error}</span>
        ) : (
          <span >Seu saldo atual: {balanceCurrentValue}</span>
        )}
      </div>

      <p  style={{
          color: "white",
          fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
          maxWidth: "90%", // Define a largura máxima do texto
        
          fontSize: "2vh", // Ajusta o tamanho da fonte para 54px
          // border:"solid 9px yellow",
          
        }}>Caso queira ver toda a sua carteira de pontos, leia o QRCode abaixo</p>

      <div className="qrcode">
        <QRCodeSVG value={randomQRCodeURL} size={520} />
      </div>

      <button onClick={() => navigate("/redirectscreen")}
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
        }}>Fechar</button>
    </div>
  );
};

export default FinalScreen;
