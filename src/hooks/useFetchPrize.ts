// hooks/useFetchPrize.ts
import { useState } from "react";

const useFetchPrize = () => {
  const [loading, setLoading] = useState(false);

  const fetchPrize = async () => {
    const organizerId = localStorage.getItem("OrganizerId");
    let cpf = localStorage.getItem("cpf");

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

      const response = await fetch(
        `https://api-back.picbrand.dev.br/Award/RescueAward/${organizerId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      setLoading(false);

      if (!response.ok) {
        throw new Error("Erro ao buscar prêmio.");
      }

      const data = await response.json();
      return data.GiftName || null;
     
    } catch (error) {
      console.error("❌ Erro ao buscar prêmio:", error);
      setLoading(false);
      return null;
    }
  };

  return { fetchPrize, loading };
};

export default useFetchPrize;
