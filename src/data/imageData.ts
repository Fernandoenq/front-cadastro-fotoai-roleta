import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/1.png';
import img5 from '../assets/2.png';

export interface ImageItem {
  id: number;
  src: string;
  label: string;
  prompt: string;
}

export const images: ImageItem[] = [
  { id: 1, src: img1, label: "Imagem 1", prompt: "A stylish pop singer performing on a neon-lit stage, wearing a trendy outfit, singing passionately into a microphone, vibrant energy --cref <> --ar 9:16 --cw 5 --s 1000" },
  { id: 2, src: img2, label: "Imagem 2", prompt: "A Brazilian musician sitting with an acoustic guitar in a cozy café, performing MPB, warm lighting, relaxed and soulful atmosphere --cref <> --ar 9:16 --cw 5 --s 1000" },
  { id: 3, src: img3, label: "Imagem 3", prompt: "A rockstar with long hair playing an electric guitar on stage, intense lighting, dark background, raw energy and powerful expression --cref <> --ar 9:16 --cw 5 --s 1000" },
  { id: 4, src: img4, label: "Imagem 4", prompt: "A futuristic DJ in a high-tech club, wearing LED glasses, surrounded by holographic visuals, adjusting turntables with a focused expression --cref <> --ar 9:16 --cw 5 --s 1000" },
  { id: 5, src: img5, label: "Imagem 5", prompt: "A dynamic dancer in a nightclub, mid-movement under colorful strobe lights, wearing a stylish outfit, feeling the rhythm of the dance music --cref <> --ar 9:16 --cw 5 --s 1000" },
];
