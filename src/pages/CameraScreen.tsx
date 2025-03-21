import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import CameraSelector from '../components/CameraSelector';
import CameraPreview from '../components/CameraPreview';
import { getVideoDevices } from '../utils/cameraUtils';
import { captureImage, uploadImage } from '../utils/imageUtils';
import '../styles/CameraScreen.css';

const CameraScreen: React.FC = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const navigate = useNavigate();
  const { callApi } = useApi();

  useEffect(() => {
    getVideoDevices().then(setDevices);
  }, []);

  useEffect(() => {
    if (devices.length > 0 && !selectedDevice) {
      setSelectedDevice(devices[0].deviceId);
    }
  }, [devices]);

  const handleCapture = () => {
    console.log("📸 Iniciando contagem regressiva para captura...");
    setIsCapturing(true);
    setCountdown(5);
    
    let counter = 5;
    const interval = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter === 0) {
        clearInterval(interval);
        console.log("📸 Capturando foto...");
        const base64Image = captureImage(document.querySelector("video"), canvasRef.current);
        if (base64Image) {
          setPhoto(base64Image);
        }
        setIsCapturing(false);
        setCountdown(null);
      }
    }, 1000);
  };

  const handleRetake = () => {
    setPhoto(null);
  };

  const handleProceed = () => {
    if (photo) {
      uploadImage(photo, callApi, navigate);
    }
  };

  return (
    <div className="page-container" style={{
      backgroundImage: `url('/img/camera/fundo_camera.png')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <header className="page-header">
      <h1 className="mb-4" style={{ color: "#cd092f" ,
          fontFamily: 'BradescoSansBold', // Aplica a fonte personalizada
        }}>Vamos começar tirando uma foto bem irada. Prepare a pose !</h1>
      </header>

      <div className="controls-container">
        <CameraSelector devices={devices} selectedDevice={selectedDevice} setSelectedDevice={setSelectedDevice} />
      </div>

      <div className="camera-container">
        <CameraPreview selectedDevice={selectedDevice} />
      </div>

      <div className="capture-container">
        {isCapturing ? (
          <p className="countdown">⏳ Capturando em {countdown}...</p>
        ) : (
          !photo && <button className="capture-button" onClick={handleCapture}>📸 Tirar Foto</button>
        )}
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {photo && (
        <div className="photo-container">
          <h4>📸 Foto Capturada:</h4>
          <img src={photo} alt="Foto Capturada" className="captured-photo" />
          <div className="photo-actions">
            <button className="retake-button" onClick={handleRetake}>🔄 Tirar Outra Foto</button>
            <button className="proceed-button" onClick={handleProceed}>✅ Continuar</button>
          </div>
        </div>
      )}

    <button className="capture-button" onClick={() => navigate("/redirectscreen")}>Voltar</button>
    </div>
  );
};

export default CameraScreen;
