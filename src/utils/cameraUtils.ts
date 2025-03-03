export const startCamera = async (deviceId: string, videoRef: React.RefObject<HTMLVideoElement | null>) => {
  if (!videoRef.current) return; // Evita erro caso o ref ainda seja null

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        deviceId: { exact: deviceId }, 
        width: { ideal: 1080 }, 
        height: { ideal: 1920 },
        aspectRatio: 16 / 9
      }
    });

    videoRef.current.srcObject = stream;
    videoRef.current.addEventListener("loadedmetadata", () => {
      console.log("📷 Câmera carregada!");
    });
  } catch (error) {
    console.error("❌ Erro ao acessar a câmera:", error);
  }
};

export const getVideoDevices = async () => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter(device => device.kind === 'videoinput');
  } catch (error) {
    console.error("❌ Erro ao listar dispositivos:", error);
    return [];
  }
};
