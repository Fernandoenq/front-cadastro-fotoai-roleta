import React, { useRef, useEffect } from 'react';
import { startCamera } from '../utils/cameraUtils';

interface CameraPreviewProps {
  selectedDevice: string | null;
}

const CameraPreview: React.FC<CameraPreviewProps> = ({ selectedDevice }) => {
  const videoRef = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    if (selectedDevice) {
      startCamera(selectedDevice, videoRef);
    }
  }, [selectedDevice]);

  return (
    <div className="camera-container">
      <video ref={videoRef} autoPlay playsInline className="camera-video" />
    </div>
  );
};

export default CameraPreview;
