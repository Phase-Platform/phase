export const isEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isPassword = (password: string): boolean => password.length >= 8;

export const isRequired = (
  value: string | number | boolean | null | undefined,
): boolean => {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  return value !== undefined && value !== null;
};
