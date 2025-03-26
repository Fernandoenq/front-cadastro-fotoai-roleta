import { useState, useCallback } from "react";

const API_URL = "https://api-fotoai.picbrand.dev.br";

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
  
      let completed = false;
      while (!completed) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2s

        const statusResponse = await fetch(`${API_URL}/progress/${taskId}`);

        if (statusResponse.status !== 200) {
          showMessage("❌ Erro ao buscar progresso da imagem");
          onError("Erro ao buscar progresso da imagem");
          break;
        }

        let statusData;
        try {
          statusData = await statusResponse.json();
        } catch (jsonError) {
          console.error("❌ Erro ao processar JSON:", jsonError);
          continue; // Não para o while, apenas ignora essa rodada
        }

        if (!statusData || typeof statusData.progress !== "number") {
          console.warn("⚠️ Resposta inválida ou sem progresso. Ignorando rodada...");
          continue; // ignora esta rodada do while
        }

        console.log("📶 Progresso recebido (polling):", statusData);
        onProgress(statusData.progress);

        if (statusData.progress === 100 && statusResponse.status === 200 && Array.isArray(statusData.image_urls)) {
          showMessage("✅ Imagens geradas com sucesso!");
          onComplete(statusData.image_urls);
          completed = true;
        }
      }

    } catch (error) {
      console.error("❌ Erro durante o polling:", error);
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
