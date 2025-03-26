// prizes.js ou prizes.ts
import kiko from "/img/roleta/premios/KIKO.png";
import agora from "/img/roleta/premios/agora.png";
import coca from "/img/roleta/premios/coca.png";
import elle from "/img/roleta/premios/elle.png";
import naofoi from "/img/roleta/premios/BRADESCO.png"; // Atualize para a imagem correta
import kit1 from "/img/roleta/premios/BRADESCO.png"; // Atualize para a imagem correta
import kit2 from "/img/roleta/premios/BRADESCO.png"; // Atualize para a imagem correta
import fastpass from "/img/roleta/premios/fastpass.png";
import lolla from "/img/roleta/premios/lolla.png";
import redbull from "/img/roleta/premios/redbull.png";

export const prizesRoleta = [
  { id:1,name: "Não Foi dessa Vez", image: naofoi },
  { id:3,name: "COCA COLA", image: coca },
  { id:4,name: "KIKO", image: kiko },
  {id:5, name: "RED BULL", image: redbull },
  { id:6,name: "ELLE", image: elle },
  { id:9,name: "LOUNGE", image: lolla },
  {id:8, name: "SHOULDER", image: agora },
  {id:7, name: "KIT 2", image: kit2 },
  { id:2,name: "SAMSUNG", image: fastpass },
];

export const prizesLoudge = [
  { id:1,name: "Não Foi dessa Vez", image: naofoi },
  { id:3,name: "COCA COLA", image: coca },
  {id:4, name: "KIKO", image: kiko },
  { id:6,name: "ELLE", image: elle },
  {id:10, name: "KIT 1", image: kit1 },
  { id:2,name: "SAMSUNG", image: fastpass },
];
// Descrições dos prêmios
export const prizeDescriptions = {
  "Não Foi dessa Vez": "Não foi dessa vez... Tente novamente mais tarde e não desista!",
  "COCA COLA": "Você ganhou um par de fastpass para a",
  "KIKO": "Você ganhou um par de fastpass para o studio",
  "RED BULL": "Você ganhou uma lata de ",
  "ELLE": "Você ganhou uma assinatura anual da ",
  "LOUNGE": "Você ganhou dois upgrade para o",
  "SHOULDER": "Você ganhou um brinde",
  "KIT 2": "Você ganhou um brinde KIT",
  "KIT 1": "Você ganhou um brinde KIT",
  "SAMSUNG": "Você ganhou um par de "
};
