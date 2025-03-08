import { useState, useEffect, useRef } from "react";

const useRfidApi = () => {
  const [rfidValue, setRfidValue] = useState("");
  const retryIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchRfidFromApi = async () => {
    try {
      const organizerId = localStorage.getItem("OrganizerId");
      if (!organizerId) {
        console.error("OrganizerId não encontrado no localStorage.");
        return;
      }

      const response = await fetch(`http://18.231.158.211:3335/Organizer/GetRegisterExternalCode/${organizerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ organizerId }),
      });

      if (!response.ok) {
        if (response.status === 422) {
          const errorData = await response.json();
          console.error("Erro 422 recebido:", errorData);
          if (errorData?.Errors?.includes("Falha na integração com o sistema") && !rfidValue) {
            console.warn("Erro na integração. Tentando novamente em 70 segundos...");
            if (!retryIntervalRef.current) {
              retryIntervalRef.current = setInterval(fetchRfidFromApi, 70000);
            }
          }
        } else {
          throw new Error(`Erro ao buscar ExternalCode: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      if (data?.ExternalCode) {
        console.log("Valor RFID recebido da API:", data.ExternalCode);
        setRfidValue(data.ExternalCode);
        localStorage.setItem("rfidValue", data.ExternalCode);
        clearRetryInterval(); // Parar a reconsulta
      } else {
        console.warn("Nenhum ExternalCode retornado pela API.");
      }
    } catch (error) {
      console.error("Erro ao buscar RFID da API:", error);
    }
  };

  useEffect(() => {
    if (!rfidValue) {
      fetchRfidFromApi();
    }

    return () => {
      clearRetryInterval(); // Limpar intervalo ao desmontar
    };
  }, [rfidValue]);

  const clearRetryInterval = () => {
    if (retryIntervalRef.current) {
      clearInterval(retryIntervalRef.current);
      retryIntervalRef.current = null;
    }
  };

  return { rfidValue, fetchRfidFromApi, clearRetryInterval };
};

export default useRfidApi;
