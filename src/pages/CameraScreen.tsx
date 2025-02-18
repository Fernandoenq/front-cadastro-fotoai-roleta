import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi'; // Importa a função da API
import '../styles/CameraScreen.css'; 

const CameraScreen: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const navigate = useNavigate();
  const { callApi } = useApi(); // Hook para chamar API

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedDevice(videoDevices[1].deviceId); // Seleciona a primeira câmera disponível
        }
      })
      .catch(error => console.error("Erro ao listar dispositivos:", error));
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      startCamera(selectedDevice);
    }
  }, [selectedDevice]);

  const startCamera = (deviceId: string) => {
    navigator.mediaDevices.getUserMedia({
      video: { 
        deviceId: { exact: deviceId }, 
        width: { ideal: 1080 }, 
        height: { ideal: 1920 },
        aspectRatio: 16 / 9
      }
    })
    .then(stream => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    })
    .catch(error => console.error("Erro ao acessar a câmera:", error));
  };

  const handleCapture = () => {
    console.log("📸 Tentando capturar foto...");
    
    if (!canvasRef.current || !videoRef.current) {
      console.error("⚠️ Canvas ou vídeo não estão disponíveis.");
      return;
    }
  
    const context = canvasRef.current.getContext('2d');
    if (!context) {
      console.error("⚠️ Erro ao obter contexto do canvas.");
      return;
    }
  
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
  
    const base64Image = canvasRef.current.toDataURL('image/png');
    setPhoto(base64Image);
  
    console.log("📸 Base64 da foto capturada:", base64Image);

    handleUpload(base64Image); // Envia a foto automaticamente
    
  };

  const handleUpload = async (base64: string) => {
    console.log("📤 Enviando foto para a API...");
  
    // Converter Base64 para Blob
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
  
    // Pega o CPF armazenado e garante que não seja null
    let cpf = localStorage.getItem("cpf") || ""; 
    if (!cpf) {
      console.error("⚠️ CPF não encontrado no localStorage!");
      return;
    }
  
    // Criar FormData
    const formData = new FormData();
    formData.append("file", blob, "captured-image.png");
    formData.append("cpf", cpf); 
  
    console.log("📤 Enviando FormData para API...");
  
    // Chamar API usando o hook `useApi`
    const response = await callApi("/Image/SaveImage", "POST", formData);
  
    if (response) {
      console.log("✅ Foto enviada com sucesso!", response);
      localStorage.setItem("Foto", response.ImageName);
      console.log(localStorage.getItem("Foto"));
      navigate('/selectimages');
    } else {
      console.error("❌ Erro ao enviar foto.");
    }
  };
  
  
  
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Captura de Foto</h1>
      </header>

      <div className="camera-container">
        {devices.length > 1 && (
          <select
            className="device-selector"
            onChange={(e) => setSelectedDevice(e.target.value)}
            value={selectedDevice || ""}
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Câmera ${devices.indexOf(device) + 1}`}
              </option>
            ))}
          </select>
        )}

        <div className="camera-box">
          <video ref={videoRef} autoPlay playsInline className="camera-video" />
        </div>

        <button className="capture-button" onClick={handleCapture}>📸 Tirar Foto</button>

        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {photo && (
          <div className="photo-container">
            <h4>📸 Foto Capturada:</h4>
            <img src={photo} alt="Foto Capturada" className="captured-photo" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraScreen;
