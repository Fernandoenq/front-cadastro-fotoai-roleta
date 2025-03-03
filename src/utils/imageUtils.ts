export const captureImage = (videoElement: HTMLVideoElement | null, canvasElement: HTMLCanvasElement | null) => {
    if (!videoElement || !canvasElement) {
      console.error("⚠️ Canvas ou vídeo não estão disponíveis.");
      return null;
    }
  
    const context = canvasElement.getContext('2d');
    if (!context) {
      console.error("⚠️ Erro ao obter contexto do canvas.");
      return null;
    }
  
    if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
      console.error("⚠️ O vídeo ainda não carregou completamente.");
      return null;
    }
  
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
  
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
  
    let cpf = localStorage.getItem("cpf") || ""; 
    if (!cpf) {
      console.error("⚠️ CPF não encontrado no localStorage!");
      return;
    }
  
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
  