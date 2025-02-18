import img1 from '../assets/1.png';
import img2 from '../assets/2.png';
import img3 from '../assets/3.png';
import img4 from '../assets/1.png';
import img5 from '../assets/2.png';
import img6 from '../assets/3.png';
import img7 from '../assets/1.png';
import img8 from '../assets/2.png';
import img9 from '../assets/3.png';
import img10 from '../assets/1.png';
import img11 from '../assets/2.png';
import img12 from '../assets/3.png';


export interface ImageItem {
  id: number;
  src: string;
  label: string;
  prompt: string;
}

export const images: ImageItem[] = [
  { id: 1, src: img1, label: "Imagem 1", prompt: "people flying style superman <> outro valor" },
  { id: 2, src: img2, label: "Imagem 2", prompt: "people flying style Dragon Ball Z <> outro valor" },
  { id: 3, src: img3, label: "Imagem 3", prompt: "people punch like a batman <> outro valor" },
  { id: 4, src: img4, label: "Imagem 4", prompt: "people running <> outro valor" },
  { id: 5, src: img5, label: "Imagem 5", prompt: "people flying style superman <> outro valor" },
  { id: 6, src: img6, label: "Imagem 6", prompt: "people flying style superman <> outro valor" },
  { id: 7, src: img7, label: "Imagem 7", prompt: "people flying style superman <> outro valor" },
  { id: 8, src: img8, label: "Imagem 8", prompt: "people flying style superman <> outro valor" },
  { id: 9, src: img9, label: "Imagem 9", prompt: "people flying style superman <> outro valor" },
  { id: 10, src: img10, label: "Imagem 10", prompt: "people flying style superman <> outro valor" },
  { id: 11, src: img11, label: "Imagem 11", prompt: "people flying style superman <> outro valor" },
  { id: 12, src: img12, label: "Imagem 12", prompt: "people flying style superman <> outro valor" },
];
