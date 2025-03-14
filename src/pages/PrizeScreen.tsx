import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import prizes from "../data/prizes"; // ✅ Importa a lista de prêmios
import "../styles/PrizeScreen.css";

const PrizeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { prizeName } = useParams<{ prizeName?: string }>(); // Defina prizeName como opcional
  const decodedPrizeName = decodeURIComponent(prizeName || ""); // Garante que prizeName nunca seja undefined
  const prize = prizes.find(prize => prize.name === decodedPrizeName);

  if (!prize) {
    return (
      <div className="brinde-container">
        <h1>Brinde não encontrado</h1>
        <button onClick={() => navigate("/")}>Voltar</button>
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

