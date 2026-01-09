export const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const isPhoneValid = (phone: string) =>
  /^\+234\d{10}$/.test(phone);
