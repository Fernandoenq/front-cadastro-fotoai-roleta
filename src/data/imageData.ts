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
  { id: 1, src: img3, label: "Imagem 1", prompt: "portrait of a person wearing a red varsity jacket worn over a tight black t-shirt, paired with distressed cargo jeans, accessorized with layers of red scarves and shawls, a large watch, sunglasses, and chunky sneakers, this person is holding a red guitar with white accents. The background features a massive rock festival stage with bright strobe lights and a crowd pumping with energy --cref <> --sref https://s.mj.run/vhswESftog0 --ar 9:16 --cw 50 --sw 50" },
  { id: 2, src: img2, label: "Imagem 2", prompt: "portrait of a person wearing a red oversized reggae print t-shirt with white details, paired with baggy pants, accessorized with large colorful bracelets, red glasses, and holding a yellow guitar. The background features a huge music festival stage with bright strobe lights and a crowd cheering with energy --cref <> --sref https://s.mj.run/vP8Lx_psuZs --ar 9:16 --cw 50 --sw 50" },
  { id: 3, src: img4, label: "Imagem 3", prompt: "A festival DJ in full command, rocking an all-black streetwear outfit with red details, including a stylish black leather jacket with red futuristic designs and bold red accessories. The DJ booth is set on a towering stage with red neon underglow, surrounded by a hyped-up crowd and massive LED screens displaying dynamic visuals --cref <> --sref https://s.mj.run/k_ouBwVW_GQ --ar 9:16 --cw 50" },
  { id: 4, src: img1, label: "Imagem 4", prompt: "portrait of a man in a red varsity jacket worn over a fitted white t-shirt paired with distressed black cargo jean shorts accessorized with layers of silver chain necklaces and bracelets, a large watch, sunglasses, and chunky sneakers. The background features a massive LED festival stage with bright strobe lights and a crowd pumping with energy --cref <> --sref https://s.mj.run/0hMV-19zlSA --ar 9:16 --cw 50 --sw 50" },
];


//           Versões da cliente              \\


// ROCK - Jaqueta vermelha, acessórios pretos, óculos escuros, guitarra vermelha e lenço vermelho, cenário palco de festival de música.
// MPB - Camisa estampada vermelha, violão vermelho, pulseiras e óculos de lente vermelha, cenário festival de música.
// EDM - Palco com mesa, com detalhes vermelhos, roupa preta e acessórios vermelhos
// POP - Shorts jeans e jaqueta vermelha, acessórios vermelhos e pretos, correntes no shorts.