export const formatWhatsapp = (value: string) => {
    return value
      .replace(/\D/g, "") 
      .replace(/^(\d{2})(\d)/, "($1) $2") 
      .replace(/(\d{5})(\d)/, "$1-$2") 
      .slice(0, 15); 
  };
  


export const validateWhatsapp = (value: string) => {
    const rawNumber = value.replace(/\D/g, "");
    return rawNumber.length === 11; 
};