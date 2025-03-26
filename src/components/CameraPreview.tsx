import { useEffect, forwardRef } from 'react';
import { startCamera } from '../utils/cameraUtils';

interface CameraPreviewProps {
  selectedDevice: string | null;
}

const CameraPreview = forwardRef<HTMLVideoElement, CameraPreviewProps>(({ selectedDevice }, ref) => {
  useEffect(() => {
    if (selectedDevice && ref && 'current' in ref && ref.current) {
      checkPermissionsAndStartCamera(selectedDevice, ref);
    }
  }, [selectedDevice, ref]);

  return (
    <div className="p-3">
      <video ref={ref} autoPlay playsInline className="camera-video" />
    </div>
  );
});

export default CameraPreview;

const checkPermissionsAndStartCamera = async (deviceId: string, videoRef: React.RefObject<HTMLVideoElement | null>) => {
  if (!videoRef.current) return;

  try {
    const permissionStatus = await navigator.permissions.query({name: 'camera'});

    if (permissionStatus.state === 'prompt' || permissionStatus.state === 'denied') {
      alert("Por favor, permita o acesso à câmera nas configurações do seu navegador para continuar.");
      return;
    }

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
