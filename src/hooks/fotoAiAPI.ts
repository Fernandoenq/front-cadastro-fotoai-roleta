import { useState, useCallback } from "react";

const API_URL = "http://127.0.0.1:3003";

const useFotoAiAPI = () => {
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");

  const showMessage = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const sendS3Url = useCallback(async (
    s3Url: string,
    onProgress: (progress: number | string) => void,
    onComplete: (images: string[]) => void,
    onError: (error: string) => void
  ) => {
    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ s3Url }),
      });
  
      const data = await response.json();
      if (!data.task_id) {
        showMessage("❌ Erro ao gerar a imagem");
        onError("Erro ao gerar a imagem");
        return;
      }
  
      console.log("✅ Task ID recebido:", data.task_id);
      const taskId = data.task_id;
  
      const eventSource = new EventSource(`${API_URL}/progress/${taskId}`);
  
      eventSource.onmessage = (event) => {
        const statusData = JSON.parse(event.data);
        console.log("📶 Progresso recebido:", statusData.progress);
  
        if (typeof statusData.progress === "number") {
          onProgress(statusData.progress);
        } else if (typeof statusData.progress === "string") {
          onProgress(statusData.progress); 
        }
  
        if (statusData.image_urls) {
          showMessage("✅ Imagens geradas com sucesso!");
          onComplete(statusData.image_urls);
          eventSource.close();
        }
      };
  
      eventSource.onerror = (error) => {
        console.error("❌ Erro no SSE:", error);
        eventSource.close();
        showMessage("❌ Erro ao buscar progresso da imagem");
        onError("Erro ao buscar progresso da imagem");
      };
  
    } catch (error) {
      console.error("❌ Erro ao conectar com o servidor:", error);
      showMessage("❌ Erro ao conectar com o servidor");
      onError("Erro ao conectar com o servidor");
    }
  }, []);
  

  const sendImageName = useCallback(async (imageName: string, cpf: string) => {
    try {
      const response = await fetch(`${API_URL}/save-image-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_name: imageName, cpf }),
      });

      const data = await response.json();
      if (response.ok) {
        showMessage("✅ Nome da imagem enviado com sucesso!");
        console.log("✅ Nome da imagem processada recebido:", data.image_name);
        return data.image_name;
      } else {
        showMessage("❌ Erro ao enviar nome da imagem");
        console.error("❌ Erro ao enviar nome da imagem:", data.error);
        return null;
      }
    } catch (error) {
      showMessage("❌ Erro ao conectar com o servidor para enviar o nome da imagem");
      console.error("❌ Erro ao conectar com o servidor para enviar o nome da imagem:", error);
      return null;
    }
  }, []);

  const sendCpf = useCallback(async (cpf: string) => {
    try {
      const response = await fetch(`${API_URL}/send-cpf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf }),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage("✅ CPF enviado com sucesso!");
        console.log("✅ CPF enviado com sucesso:", data);
        return data;
      } else {
        showMessage("❌ Erro ao enviar CPF");
        console.error("❌ Erro ao enviar CPF:", data.error);
        return null;
      }
    } catch (error) {
      showMessage("❌ Erro ao conectar com o servidor para enviar CPF");
      console.error("❌ Erro ao conectar com o servidor para enviar CPF:", error);
      return null;
    }
  }, []);

  return { sendS3Url, sendImageName, sendCpf, showPopup, popupMessage };
};

export default useFotoAiAPI;
