import img1 from '../assets/rock.png';
import img2 from '../assets/POP.png';
import img3 from '../assets/EDM.png';
import img4 from '../assets/MPB.png';

export interface ImageItem {
  id: number;
  src: string;
  label: string;
  prompt: string;
}

export const images: ImageItem[] = [
  { id: 1, src: img3, label: "Imagem 1", prompt: "A rockstar with long hair playing an electric guitar on stage, intense lighting, dark background, raw energy and powerful expression --cref <> --ar 9:16 --cw 5 --s 1000" },
  { id: 2, src: img2, label: "Imagem 2", prompt: "A Brazilian musician sitting with an acoustic guitar in a cozy café, performing MPB, warm lighting, relaxed and soulful atmosphere --cref <> --ar 9:16 --cw 5 --s 1000" },
  { id: 3, src: img4, label: "Imagem 3", prompt: "A futuristic DJ in a high-tech club, wearing LED glasses, surrounded by holographic visuals, adjusting turntables with a focused expression --cref <> --ar 9:16 --cw 5 --s 1000" },
  { id: 4, src: img1, label: "Imagem 4", prompt: "A stylish pop singer performing on a neon-lit stage, wearing a trendy outfit, singing passionately into a microphone, vibrant energy --cref <> --ar 9:16 --cw 5 --s 1000" },
];


//           Versões da cliente              \\


// ROCK - Jaqueta vermelha, acessórios pretos, óculos escuros, guitarra vermelha e lenço vermelho, cenário palco de festival de música.
// MPB - Camisa estampada vermelha, violão vermelho, pulseiras e óculos de lente vermelha, cenário festival de música.
// EDM - Palco com mesa, com detalhes vermelhos, roupa preta e acessórios vermelhos
// POP - Shorts jeans e jaqueta vermelha, acessórios vermelhos e pretos, correntes no shorts.