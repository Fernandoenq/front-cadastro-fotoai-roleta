export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 🔥 Valida formato padrão de e-mail
    return emailRegex.test(email);
  };
  