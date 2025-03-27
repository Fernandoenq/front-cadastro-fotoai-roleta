import { useEffect, forwardRef, useState } from 'react';

interface CameraPreviewProps {
  selectedDevice: string | null;
}

const CameraPreview = forwardRef<HTMLVideoElement, CameraPreviewProps>(({ selectedDevice }, ref) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Solicita permissão à câmera
  useEffect(() => {
    const requestPermission = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Seu navegador não suporta acesso à câmera.");
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Fecha stream de teste
        setHasPermission(true);
      } catch (err: any) {
        setError('Não foi possível acessar a câmera: ' + err.message);
        setHasPermission(false);
      }
    };

    requestPermission();
  }, []);

  // Inicia a câmera quando há permissão e device selecionado
  useEffect(() => {
    if (hasPermission && selectedDevice && ref && 'current' in ref && ref.current) {
      checkPermissionsAndStartCamera(selectedDevice, ref);
    }
  }, [hasPermission, selectedDevice, ref]);

  return (
    <div className="p-3">
      {hasPermission ? (
        <video ref={ref} autoPlay playsInline className="camera-video" />
      ) : (
        <p>{error ? error : 'Solicitando acesso à câmera...'}</p>
      )}
    </div>
  );
});

export default CameraPreview;

const checkPermissionsAndStartCamera = async (
  deviceId: string,
  videoRef: React.RefObject<HTMLVideoElement | null>
) => {
  if (!videoRef.current) return;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: deviceId },
        width: { ideal: 1080 },
        height: { ideal: 1920 },
        aspectRatio: 16 / 9,
      },
    });

    videoRef.current.srcObject = stream;
    videoRef.current.addEventListener('loadedmetadata', () => {
      console.log('📷 Câmera carregada!');
    });
  } catch (error) {
    console.error('❌ Erro ao acessar a câmera:', error);
  }
};
