import { useState } from "react"; 

const API_BASE_URL = "http://18.231.158.211:3335"; // Base da API

// Use API 2 (Agora com popup)
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
        headers: isFormData ? {} : { "Content-Type": "application/json" }, 
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
        setPopupMessage("✅ Sucesso!");
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        return result !== null ? result : {}; 
      } else {
        const errorMessage = result?.Errors?.[0] || "Erro desconhecido.";
        setPopupMessage(`❌ ${errorMessage}`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);
        console.error("❌ Erro na API:", errorMessage);
        return null;
      }
    } catch (error) {
      setPopupMessage("🚨 Erro de conexão com a API");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      console.error("🚨 Erro de conexão:", error);
      return null;
    }
  };

  return { callApi, showPopup, popupMessage };
};
