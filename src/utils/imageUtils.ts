interface VideoElement extends HTMLVideoElement {}
interface CanvasElement extends HTMLCanvasElement {}

export const captureImage = (
  videoElement: VideoElement | null, 
  canvasElement: CanvasElement | null, 
  cropWidth: number
): string | null => {
  if (!videoElement || !canvasElement) {
    console.error("Canvas ou vídeo não estão disponíveis.");
    return null;
  }

  const context = canvasElement.getContext('2d');
  if (!context) {
    console.error("Erro ao obter contexto do canvas.");
    return null;
  }

  if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
    console.error("O vídeo ainda não carregou completamente.");
    return null;
  }

  // Calcula as coordenadas para recortar apenas o meio
  const startX = (videoElement.videoWidth - cropWidth) / 2;
  const startY = 0; // Começa do topo

  canvasElement.width = cropWidth;
  canvasElement.height = videoElement.videoHeight; // Mantém a altura original

  // Desenha apenas a área desejada do vídeo no canvas
  context.drawImage(videoElement, startX, startY, cropWidth, videoElement.videoHeight, 0, 0, cropWidth, videoElement.videoHeight);

  return canvasElement.toDataURL('image/png');
};

  export const uploadImage = async (base64: string, callApi: any, navigate: any) => {
    console.log("📤 Enviando foto para a API...");
  
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
  
    // let cpf = localStorage.getItem("cpf") || ""; 
    // if (!cpf) {
    //   console.error("⚠️ CPF não encontrado no localStorage!");
    //   return;
    // }
    let cpf = localStorage.getItem("cpf") || "02905849061"; // CPF padrão caso não exista no localStorage
  
    const formData = new FormData();
    formData.append("file", blob, "captured-image.png");
    formData.append("cpf", cpf); 
  
    console.log("📤 Enviando FormData para API...");
  
    const response = await callApi("/Image/SaveImage", "POST", formData);
  
    if (response) {
      console.log("✅ Foto enviada com sucesso!", response);
      localStorage.setItem("Foto", response.ImageName);
      navigate('/selectimages');
    } else {
      console.error("❌ Erro ao enviar foto.");
    }
  };
  