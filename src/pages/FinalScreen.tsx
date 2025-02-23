import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import useFotoAiAPI from "../hooks/fotoAiAPI";
import "../styles/FinalScreen.css";

const FinalScreen: React.FC = () => {
  const navigate = useNavigate();
  const { sendCpf } = useFotoAiAPI();
  const [balanceCurrentValue, setBalanceCurrentValue] = useState<number | null>(null);

  const cpf = localStorage.getItem("cpf") || "";

  useEffect(() => {
    if (!cpf) {
      console.error("⚠️ CPF não encontrado no localStorage!");
      return;
    }

    console.log("📌 CPF encontrado:", cpf);

    // ✅ Chamando sendCpf e pegando a resposta para atualizar o saldo
    const fetchBalance = async () => {
        try {
          const response = await sendCpf(cpf); // ✅ Agora pegando o retorno da função
      
          console.log("📩 Resposta recebida no fetchBalance:", response); // 🔹 Debug para ver o que está chegando
      
          // ✅ Verifica se a resposta é um array e se tem pelo menos um item válido
          if (Array.isArray(response) && response.length > 0 && response[0]?.BalanceCurrentValue !== undefined) {
            console.log("✅ Atualizando saldo para:", response[0].BalanceCurrentValue);
            setBalanceCurrentValue(response[0].BalanceCurrentValue); // ✅ Pegando sempre o primeiro item corretamente
          } else {
            console.error("❌ Erro ao buscar saldo: Estrutura de resposta inválida.", response);
          }
        } catch (error) {
          console.error("🚨 Erro ao buscar saldo:", error);
        }
      };
      
      

    fetchBalance();
  }, [cpf, sendCpf]);

  const randomQRCodeURL = "https://example.com";

  return (
    <div className="final-container">
      <h1>Obrigado por ter participado</h1>
      <p>Parabéns Fernando Almeida</p>

      <div className="saldo">
        <span>Seu saldo atual: {balanceCurrentValue !== null ? balanceCurrentValue : "Carregando..."}</span>
      </div>

      <p>Caso queira ver toda a sua carteira de pontos, leia o QRCode abaixo</p>

      <div className="qrcode">
        <QRCodeSVG value={randomQRCodeURL} size={120} />
      </div>

      <button onClick={() => navigate("/")}>Fechar</button>
    </div>
  );
};

export default FinalScreen;
