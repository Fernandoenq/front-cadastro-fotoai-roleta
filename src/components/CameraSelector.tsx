import React from 'react';

interface CameraSelectorProps {
  devices: MediaDeviceInfo[];
  selectedDevice: string | null;
  setSelectedDevice: (deviceId: string) => void;
}

const CameraSelector: React.FC<CameraSelectorProps> = ({ devices, selectedDevice, setSelectedDevice }) => {
  if (devices.length <= 1) return null; // Só mostra o seletor se houver mais de uma câmera

  return (
    <div>
      <h4>📷 Escolha uma câmera:</h4>
      <select
        className="device-selector"
        onChange={(e) => setSelectedDevice(e.target.value)}
        value={selectedDevice || ""}
      >
        {devices.map((device, index) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Câmera ${index + 1}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CameraSelector;
