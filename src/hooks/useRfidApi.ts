import { useState, useEffect, useRef } from "react";

const useRfidApi = () => {
  const [rfidValue, setRfidValue] = useState("");
  const retryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isFirstCallDone = useRef(false);
  const isUnmounted = useRef(false); // 🔹 Flag para evitar chamadas desnecessárias após desmontar

  const fetchRfidFromApi = async () => {
    try {
      if (isUnmounted.current) return; // 🔹 Evita requisições desnecessárias se o hook foi desmontado

      const organizerId = localStorage.getItem("OrganizerId");
      if (!organizerId) {
        console.error("OrganizerId não encontrado no localStorage.");
        return;
      }

      const response = await fetch(
        `https://api-back.picbrand.dev.br/Organizer/GetRegisterExternalCode/${organizerId}`,
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
    if (isUnmounted.current) return; // 🔹 Evita iniciar intervalos se o hook foi desmontado

    if (!retryIntervalRef.current && !rfidValue) {
      console.log("Iniciando ciclos de consulta a cada 10 segundos...");
      retryIntervalRef.current = setInterval(fetchRfidFromApi, 10000);
    }
  };

  const stopRetry = () => {
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }
    console.log("🚀 Chamadas da API foram interrompidas!");
  };

  const resetRfidApi = () => {
    console.log("🔄 Resetando estado do RFID API...");
    stopRetry();
    setRfidValue("");
    isFirstCallDone.current = false;
  };

  useEffect(() => {
    isUnmounted.current = false; // 🔹 Define como montado

    if (!isFirstCallDone.current) {
      isFirstCallDone.current = true;
      console.log("📡 Primeira chamada à API...");
      fetchRfidFromApi();
      setTimeout(startRetry, 10000); // Inicia os ciclos após 10 segundos
    }

    return () => {
      console.log("🛑 Hook desmontado! Limpando tudo...");
      isUnmounted.current = true; // 🔹 Marca que o hook foi desmontado
      stopRetry();
    };
  }, []);

  return { rfidValue, clearRetryInterval: stopRetry, resetRfidApi };
};

export default useRfidApi;
