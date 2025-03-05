import React from "react";
import { ageProfiles } from "../utils/ageProfiles"

interface AgeDropdownProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const AgeDropdown: React.FC<AgeDropdownProps> = ({ value, onChange }) => {
  return (
    <div className="input-container">
      <label className="input-label">Perfil de Idade:</label>
      <select
        name="idadePerfil"
        className="input-field"
        value={value}
        onChange={onChange}
      >
        <option value="">Selecione...</option>
        {ageProfiles.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AgeDropdown;
