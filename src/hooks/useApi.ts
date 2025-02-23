import { useState } from "react"; 

const API_BASE_URL = "http://18.231.158.211:3335"; // Base da API

export const useApi = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");

  const callApi = async (
    endpoint: string, 
    method: "GET" | "POST" | "PUT" | "DELETE", 
    body?: object | FormData
  ) => {
    try {
      const isFormData = body instanceof FormData;
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: isFormData ? {} : { "Content-Type": "application/json" }, // Não define header se for FormData
        body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
      });

      let result = null;

      if (response.status !== 204) {
        try {
          result = await response.json();
        } catch (error) {
          console.warn("⚠️ Resposta da API não contém JSON válido.");
        }
      }

      console.log("📩 Resposta da API:", result);

      if (response.ok) {
        return result !== null ? result : {}; 
      } else {
        const errorMessage = result?.Errors?.[0] || "Erro desconhecido.";
        console.error("❌ Erro na API:", errorMessage);
        return null;
      }
    } catch (error) {
      console.error("🚨 Erro de conexão:", error);
      return null;
    }
  };

  
  
  return { callApi, showPopup, popupMessage };
};
