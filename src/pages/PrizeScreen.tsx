import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import prizes from "../data/prizes"; 
import "../styles/PrizeScreen.css";

const PrizeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { prizeName } = useParams<{ prizeName?: string }>(); 
  const decodedPrizeName = decodeURIComponent(prizeName || ""); 
  const prize = prizes.find(prize => prize.name === decodedPrizeName);

  if (!prize) {
    return (
      <div className="prize-container">
        <h1>Brinde não encontrado</h1>
        <button onClick={() => navigate("/redirectscreen")}>Sair</button>
      </div>
    );
  }

  return (
    <div className="prize-container">
      <h1>Retire o seu brinde</h1>
      <img src={prize.image} alt={prize.name} className="prize-image" />
      <button onClick={() => navigate("/finalscreen")}>Avançar</button>
    </div>
  );
};

export default PrizeScreen;

