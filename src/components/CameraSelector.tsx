import React from 'react';
import '../styles/CameraScreen.css'
interface CameraSelectorProps {
  devices: MediaDeviceInfo[];
  selectedDevice: string | null;
  setSelectedDevice: (deviceId: string) => void;
}

const CameraSelector: React.FC<CameraSelectorProps> = () => {
   // Renderiza null se não precisar mostrar o seletor
   return null;
  // if (devices.length <= 1) return null; 

  // return (
  //   <div>
  //     <p  className="mb-4 "   style={{
  //           color: "white",
  //           fontFamily: "BradescoSansBold", // Aplica a fonte personalizada
  //           fontSize: "2vh", // Ajusta o tamanho da fonte para 54px
  //           maxWidth: "100%", // Define a largura máxima do texto
  //           margin: "0 auto", // Centraliza o texto horizontalmente
  //         }}>📷 Escolha uma câmera:</p>
  //     <select 
  //       className="device-selector  "
  //       onChange={(e) => setSelectedDevice(e.target.value)}
  //       value={selectedDevice || ""}
  //     >
  //       {devices.map((device, index) => (
  //         <option key={device.deviceId} value={device.deviceId}>
  //           {device.label || `Câmera ${index + 1}`}
  //         </option>
  //       ))}
  //     </select>
  //   </div>
  // );
};

export default CameraSelector;
