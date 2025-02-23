import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Importação para navegação
import "../styles/RouletteScreen.css"
import prizes from "../data/prizes"; // ✅ Importa a lista de prêmios

import pointer from "../assets/pointer.png";
import wheel from "../assets/wheel.png";

const selectedPrize = "Mochila Executiva"; // ✅ Nome exato do prêmio conforme lista

const RoletaScreen: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate(); // ✅ Hook de navegação

  const spinWheel = () => {
    if (isSpinning) return; // Evita múltiplos giros
    setIsSpinning(true);

    // 🔹 Busca o índice do prêmio na lista
    const prizeIndex = prizes.findIndex(prize => prize.name === selectedPrize);
    if (prizeIndex === -1) {
      console.error("❌ Prêmio não encontrado na lista!");
      setIsSpinning(false);
      return;
    }

    // 🔹 Cada posição está a 30° (360° / 12 prêmios)
    const anglePerPrize = 360 / prizes.length;
    const targetRotation = 360 * 5 + prizeIndex * anglePerPrize; // 5 voltas + posição correta

    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      console.log(`🎁 O ponteiro parou em: ${selectedPrize}`);

      // ✅ Redireciona para a página do brinde
      navigate(`/roleta/${selectedPrize}`);
    }, 3000); // Aguarda 3 segundos antes de redirecionar
  };

  return (
    <div className="roleta-container">
      <h1>Gire a roleta</h1>

      <div className="roleta-wrapper">
        <img src={wheel} alt="Roleta" className="roleta" />
        <img
          src={pointer}
          alt="Ponteiro"
          className="pointer"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 3s ease-out" : "none"
          }}
        />
      </div>

      <button onClick={spinWheel} disabled={isSpinning} className="roleta-button">
        {isSpinning ? "Girando..." : "Girar a roleta"}
      </button>
    </div>
  );
};

export default RoletaScreen;
