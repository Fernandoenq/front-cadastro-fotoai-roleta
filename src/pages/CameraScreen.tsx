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
    console.log("📸 Tentando capturar foto...");
    const base64Image = captureImage(document.querySelector("video"), canvasRef.current);
    if (base64Image) {
      setPhoto(base64Image);
      uploadImage(base64Image, callApi, navigate);
    }
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <h1>📷 Captura de Foto</h1>
      </header>

      <div className="controls-container">
        <CameraSelector devices={devices} selectedDevice={selectedDevice} setSelectedDevice={setSelectedDevice} />
      </div>

      <div className="camera-container">
        <CameraPreview selectedDevice={selectedDevice} />
      </div>

      <div className="capture-container">
        <button className="capture-button" onClick={handleCapture}>📸 Tirar Foto</button>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {photo && (
        <div className="photo-container">
          <h4>📸 Foto Capturada:</h4>
          <img src={photo} alt="Foto Capturada" className="captured-photo" />
        </div>
      )}
    </div>
  );
};

export default CameraScreen;
