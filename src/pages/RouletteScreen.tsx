import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RouletteScreen.css";
import prizes from "../data/prizes";
import pointer from "../assets/pointer.png";
import wheel from "../assets/wheel.png";

const RoletaScreen: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPrize = async () => {
    const organizerId = localStorage.getItem("OrganizerId");
    let cpf = localStorage.getItem("cpf");
    console.log(organizerId);
    console.log(cpf);

    if (!organizerId || !cpf) {
      console.error("❌ OrganizerId ou CPF não encontrado no localStorage!");
      return null;
    }

    cpf = cpf.trim();
    if (cpf.length !== 11 || isNaN(Number(cpf))) {
      console.error("❌ CPF inválido, ele deve ter 11 dígitos numéricos!");
      return null;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("Cpf", cpf);

      const response = await fetch(`https://api-back.picbrand.dev.br/Award/RescueAward/${organizerId}`, {
        method: "PUT",
        body: formData,
      });

      setLoading(false);
      
      if (!response.ok) {
        throw new Error("Erro ao buscar prêmio.");
      }

      const data = await response.json();
      return data.GiftName || null;
    } catch (error) {
      console.error("❌ Erro ao buscar prêmio:", error);
      return null;
    }
  };

  const spinWheel = async () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setRotation(0);

    const prize = await fetchPrize();
    if (!prize) {
      console.error("❌ Nenhum prêmio retornado!");
      setIsSpinning(false);
      return;
    }

    const prizeIndex = prizes.findIndex(prizeItem => prizeItem.name === prize);
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
      console.log(`🎁 O ponteiro parou em: ${prize}`);
      navigate(`/roleta/${encodeURIComponent(prize)}`);
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
            transition: isSpinning ? "transform 3s ease-out" : "none",
          }}
        />
        <img src={pointer} alt="Ponteiro" className="pointer" />
      </div>

      <button onClick={spinWheel} disabled={isSpinning || loading} className="roleta-button">
        {isSpinning ? "Girando..." : loading ? "Buscando prêmio..." : "Girar a roleta"}
      </button>
    </div>
  );
};

export default RoletaScreen;
