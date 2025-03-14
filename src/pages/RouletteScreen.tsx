import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RouletteScreen.css";
import prizes from "../data/prizes";

import pointer from "../assets/pointer.png";
import wheel from "../assets/wheel.png";

const selectedPrize = "Ingresso Sábado 29/03";

const RoletaScreen: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const prizeIndex = prizes.findIndex(prize => prize.name === selectedPrize);
    if (prizeIndex === -1) {
        console.error("❌ Prêmio não encontrado na lista!");
        setIsSpinning(false);
        return;
    }

    const anglePerPrize = 360 / prizes.length;
    
    const prizeAngle = prizeIndex * anglePerPrize + anglePerPrize / 2;

    const targetRotation = 360 * 5 + prizeAngle;

    setRotation(targetRotation);

    setTimeout(() => {
        setIsSpinning(false);
        console.log(`🎁 O ponteiro parou em: ${selectedPrize}`);
        navigate(`/roleta/${selectedPrize}`);
    }, 5000);
};


  return (
    <div className="roleta-container">
      <h1>Gire a roleta</h1>

      <div className="roleta-wrapper">
        <img
          src={wheel}
          alt="Roleta"
          className="roleta"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? "transform 3s ease-out" : "none"
          }}
        />
        <img src={pointer} alt="Ponteiro" className="pointer" />
      </div>

      <button onClick={spinWheel} disabled={isSpinning} className="roleta-button">
        {isSpinning ? "Girando..." : "Girar a roleta"}
      </button>
    </div>
  );
};

export default RoletaScreen;
