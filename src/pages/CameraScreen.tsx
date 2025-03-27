import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import CameraSelector from "../components/CameraSelector";
import CameraPreview from "../components/CameraPreview";
import { getVideoDevices } from "../utils/cameraUtils";
import { captureImage, uploadImage } from "../utils/imageUtils";
import "../styles/CameraScreen.css";

const CameraScreen: React.FC = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { callApi } = useApi();

  useEffect(() => {
    getVideoDevices().then((devices) => {
      setDevices(devices);
      if (devices.length > 0) {
        setSelectedDevice(devices[0].deviceId); // Sempre selecione a primeira câmera automaticamente
      }
    });
  }, []);
  useEffect(() => {
    if (devices.length > 0 && !selectedDevice) {
      setSelectedDevice(devices[0].deviceId);
    }
  }, [devices]);
  
    const handleCapture = () => {
      setIsCapturing(true);
      setCountdown(5);
    
      let counter = 5;
      const interval = setInterval(() => {
        counter--;
        setCountdown(counter);
        if (counter === 0) {
          clearInterval(interval);
    
          // Ajusta aqui para definir a largura desejada do recorte
          const desiredCropWidth = videoRef.current ? videoRef.current.videoWidth * 0.5 : 0; // Recorta 50% da largura central
    
          const base64Image = captureImage(
            videoRef.current,
            canvasRef.current,
            desiredCropWidth
          );
    
          if (base64Image) {
            setPhoto(base64Image);
            uploadImage(base64Image, callApi, () => {
              navigate("/selectimages");
            });
          }
          setIsCapturing(false);
          setCountdown(null);
        }
      }, 1000);
    };
    


  return (
    <div
      className="page-container"
      style={{
        backgroundImage: `url('/img/camera/fundo_camera.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <header className="page-header" style={{ textAlign: "center" }}>
        <h1
          className="mb-4"
          style={{
            color: "white",
            fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
            maxWidth: "80%", // Define a largura máxima do texto
            margin: "0px auto 0 auto", // Margem superior negativa para subir o texto
            fontSize: "3vh", // Ajusta o tamanho da fonte para 54px
          }}
        >
          Vamos começar tirando uma foto bem irada.
        </h1>
        <h1
          className=""
          style={{
            color: "white",
            fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
            maxWidth: "80%", // Define a largura máxima do texto
            fontSize: "3vh", // Ajusta o tamanho da fonte para 54px
            margin: "0px auto 0 auto", // Margem superior negativa para subir o texto
          }}
        >
          Prepare a pose!
        </h1>
      </header>

      <div className="controls-container  block w-full px-3 py-2 text-white rounded-full placeholder-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ">
        <CameraSelector
          devices={devices}
          selectedDevice={selectedDevice}
          setSelectedDevice={setSelectedDevice}
        />
      </div>

      <div className="camera-container" style={{ position: "relative" }}>
      <CameraPreview ref={videoRef} selectedDevice={selectedDevice} />
      </div>

      <div className="">
        {isCapturing ? (
          <p className="countdown">⏳ Capturando em {countdown}...</p>
        ) : (
          !photo && (
            <button className="capture-button" onClick={handleCapture}></button>
          )
        )}
      </div>
      <button
              className="confirm-button"
              onClick={() => navigate("/redirectscreen")}  // Navega para a página anterior
             
              style={{
                backgroundColor: "#cd092f",
                color: "white",
                borderColor: "white",
                borderWidth: "4px",
                borderStyle: "solid",
                borderRadius: "9999px",
                padding: "18px 20px",
                fontSize: "2vh",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                height: "100px",
                fontFamily: "BradescoSansButtom",
                width: "20vh",
                
              }}
            >
              Voltar
            </button>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* {photo && (
        <div className="photo-container">
          <h4>📸 Foto Capturada:</h4>
          <img src={photo} alt="Foto Capturada" className="captured-photo" />
          <div className="photo-actions">
            <button className="retake-button" onClick={handleRetake}>
              🔄 Tirar Outra Foto
            </button>
            <button className="proceed-button" onClick={handleProceed}>
              ✅ Continuar
            </button>
          </div>
        </div>
      )} */}

      {/* <button className="capture-button" onClick={() => navigate("/redirectscreen")}>Voltar</button> */}
    </div>
  );
};

export default CameraScreen;