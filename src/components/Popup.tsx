import React from "react";
import "../styles/Popup.css"

interface PopupProps {
  show: boolean;
  message: string;
}

const Popup: React.FC<PopupProps> = ({ show, message }) => {
  if (!show) return null;
  
  return <div className="popup">{message}</div>;
};

export default Popup;
