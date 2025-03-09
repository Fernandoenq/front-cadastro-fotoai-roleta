import { useState, useEffect, useRef } from "react";

const useRfidApi = () => {
  const [rfidValue, setRfidValue] = useState("");
  const retryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstCallDone = useRef(false); // 🔹 Controla a primeira chamada única

  const fetchRfidFromApi = async () => {
    try {
      const organizerId = localStorage.getItem("OrganizerId");
      if (!organizerId) {
        console.error("OrganizerId não encontrado no localStorage.");
        return;
      }

      const response = await fetch(
        `http://18.231.158.211:3335/Organizer/GetRegisterExternalCode/${organizerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ organizerId }),
        }
      );

      if (!response.ok) {
        if (response.status === 422) {
          const errorData = await response.json();
          console.error("Erro 422 recebido:", errorData);
          console.warn("Erro na integração. Tentando novamente em 10 segundos...");
          startRetry();
        } else {
          throw new Error(`Erro ao buscar ExternalCode: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      if (data?.ExternalCode) {
        console.log("✅ Valor RFID recebido da API:", data.ExternalCode);
        setRfidValue(data.ExternalCode);
        localStorage.setItem("rfidValue", data.ExternalCode);

        stopRetry(); // 🚀 Assim que um RFID válido for encontrado, para as consultas
      } else {
        console.warn("Nenhum ExternalCode retornado pela API.");
        startRetry();
      }
    } catch (error) {
      console.error("Erro ao buscar RFID da API:", error);
      startRetry();
    }
  };

  const startRetry = () => {
    if (!retryIntervalRef.current && !rfidValue) { // 🔹 Só inicia se ainda não houver um RFID válido
      console.log("Iniciando ciclos de consulta a cada 10 segundos...");
      retryIntervalRef.current = setInterval(fetchRfidFromApi, 10000);
    }
  };

  const stopRetry = () => {
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    console.log("🚀 Chamadas da API foram interrompidas!");
  };

  const resetRfidApi = () => {
    console.log("🔄 Resetando estado do RFID API...");
    stopRetry();
    setRfidValue("");
    isFirstCallDone.current = false; // 🔹 Garante que a primeira chamada ocorra de novo na reabertura
  };

  useEffect(() => {
    if (!isFirstCallDone.current) {
      isFirstCallDone.current = true; // 🔹 Marca que a primeira chamada foi feita
      console.log("📡 Primeira chamada à API (ignorada para iniciar ciclos futuros)...");
      fetchRfidFromApi(); // Faz a primeira chamada única
      setTimeout(startRetry, 10000); // Inicia os ciclos após 10 segundos
    }

    return () => {
      stopRetry(); // Limpar intervalos ao desmontar
    };
  }, []);

  return { rfidValue, clearRetryInterval: stopRetry, resetRfidApi };
};

export default useRfidApi;
