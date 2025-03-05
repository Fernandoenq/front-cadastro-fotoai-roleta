export const formatWhatsapp = (whatsapp: string): string => {
  const cleaned = whatsapp.replace(/\D/g, ""); // Remove tudo que não for número

  // Formatação para (XX) XXXXX-XXXX
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  // Formatação para (XX) XXXX-XXXX (se for número fixo)
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  }

  return cleaned; // Retorna sem formatação caso o tamanho não seja válido
};

export const unformatWhatsapp = (whatsapp: string): string => {
  return whatsapp.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
};

  


export const validateWhatsapp = (value: string) => {
    const rawNumber = value.replace(/\D/g, "");
    return rawNumber.length === 11; 
};

