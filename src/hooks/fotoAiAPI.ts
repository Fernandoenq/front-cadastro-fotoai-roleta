import { useCallback } from "react";

const API_URL = "http://127.0.0.1:5000";

const useFotoAiAPI = () => {
  const sendS3Url = useCallback(async (s3Url: string, onProgress: (progress: number) => void, onComplete: (images: string[]) => void, onError: (error: string) => void) => {
    try {
      // Envia o prompt para gerar a imagem
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ s3Url }),
      });

      const data = await response.json();
      if (!data.task_id) {
        onError("Erro ao gerar a imagem");
        return;
      }

      console.log("✅ Task ID recebido:", data.task_id);
      const taskId = data.task_id;

      // Monitora o progresso usando Server-Sent Events (SSE)
      const eventSource = new EventSource(`${API_URL}/progress/${taskId}`);

      eventSource.onmessage = (event) => {
        const statusData = JSON.parse(event.data);

        if (statusData.progress) {
          onProgress(Number(statusData.progress));
        }

        if (statusData.image_urls) {
          onComplete(statusData.image_urls);
          eventSource.close();
        }
      };

      eventSource.onerror = (error) => {
        console.error("Erro no SSE:", error);
        eventSource.close();
        onError("Erro ao buscar progresso da imagem");
      };

    } catch (error) {
      console.error("❌ Erro ao conectar com o servidor:", error);
      onError("Erro ao conectar com o servidor");
    }
  }, []);

  // 🔹 **Função Atualizada: Agora também envia o CPF**
  const sendImageName = useCallback(async (imageName: string, cpf: string) => {
    try {
      const response = await fetch(`${API_URL}/save-image-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_name: imageName, cpf }), // ✅ Enviando CPF junto com o nome da imagem
      });

      const data = await response.json();
      if (response.ok) {
        console.log("✅ Nome da imagem processada recebido:", data.image_name);
        return data.image_name;  // Retorna o nome da imagem processada
        
      } else {
        console.error("❌ Erro ao enviar nome da imagem:", data.error);
      }
    } catch (error) {
      console.error("❌ Erro ao conectar com o servidor para enviar o nome da imagem:", error);
    }
  }, []);

  const sendCpf = useCallback(async (cpf: string) => {
    try {
      const response = await fetch(`${API_URL}/send-cpf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf }), // 🔹 Enviando apenas o CPF
      });
  
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ CPF enviado com sucesso:", data);
        return data; // ✅ Retornando os dados corretamente
      } else {
        console.error("❌ Erro ao enviar CPF:", data.error);
        return null; // ✅ Retorna null em caso de erro para evitar undefined
      }
    } catch (error) {
      console.error("❌ Erro ao conectar com o servidor para enviar CPF:", error);
      return null; // ✅ Retorna null em caso de falha na requisição
    }
  }, []);
  

  return { sendS3Url, sendImageName, sendCpf };
};

export default useFotoAiAPI;
