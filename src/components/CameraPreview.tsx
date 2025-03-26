// CameraPreview.js
import React, { useRef, useEffect, forwardRef } from 'react';
import { startCamera } from '../utils/cameraUtils';

interface CameraPreviewProps {
  selectedDevice: string | null;
}

const CameraPreview = forwardRef<HTMLVideoElement, CameraPreviewProps>(({ selectedDevice }, ref) => {
  useEffect(() => {
    if (selectedDevice && ref && 'current' in ref && ref.current) {
      startCamera(selectedDevice, ref);
    }
  }, [selectedDevice, ref]);

  return (
    <div className="p-3">
      <video ref={ref} autoPlay playsInline className="camera-video" />
    </div>
  );
});

export default CameraPreview;
