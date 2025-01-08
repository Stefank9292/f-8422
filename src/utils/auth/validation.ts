export const validatePassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must include at least one number";
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    return "Password must include at least one special character";
  }
  return null;
};

export const checkPasswordStrength = (password: string) => {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  let score = 0;
  let message = "";
  let color = "";
  
  // Base score from length
  if (password.length >= 12) score += 2;
  else if (password.length >= 8) score += 1;
  
  // Additional criteria
  if (hasUppercase) score += 1;
  if (hasLowercase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecialChar) score += 1;
  
  // Determine strength level
  if (score <= 2) {
    return {
      score: (score / 6) * 100,
      message: "Weak – Add uppercase, lowercase, numbers, and special characters",
      color: "bg-red-500"
    };
  } else if (score <= 4) {
    return {
      score: (score / 6) * 100,
      message: "Medium – Make it longer and add more character types",
      color: "bg-yellow-500"
    };
  } else {
    return {
      score: 100,
      message: "Strong – Great password!",
      color: "bg-green-500"
    };
  }
};