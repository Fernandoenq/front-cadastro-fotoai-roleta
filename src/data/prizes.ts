import bag from "../assets/prizes/bag.png";
import headset from "../assets/prizes/headset.png";
import plastic_bottle from "../assets/prizes/plastic-bottle.png";
import mug from "../assets/prizes/mug.png";
import shirt from "../assets/prizes/shirt.png";
import mouse from "../assets/prizes/mouse.png";
import teclado from "../assets/prizes/keyboard.png";
import powerbank from "../assets/prizes/powerbank.png";
import hat from "../assets/prizes/hat.png";
import glasses from "../assets/prizes/glasses.png";
import clock from "../assets/prizes/clock.png";
import microphone from "../assets/prizes/microphone.png"; // Para o caso de não ganhar nada

const prizes = [
  { name: "Mochila Executiva", image: bag },
  { name: "Fone Bluetooth", image: headset },
  { name: "Garrafa Térmica", image: plastic_bottle },
  { name: "Caneca Personalizada", image: mug },
  { name: "Camiseta Exclusiva", image: shirt },
  { name: "Mouse Gamer", image: mouse },
  { name: "Teclado Mecânico", image: teclado },
  { name: "Carregador Portátil", image: powerbank },
  { name: "Boné Personalizado", image: hat },
  { name: "Óculos", image: glasses },
  { name: "Relógio Inteligente", image: clock },
  { name: "Microfone ", image: microphone }, // Caso não ganhe nada
];

export default prizes;
