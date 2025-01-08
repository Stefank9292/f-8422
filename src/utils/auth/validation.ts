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
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
  
  // Calculate base score
  let score = 0;
  let message = "";
  let color = "";
  
  // Length criteria
  if (password.length >= 12) score += 40;
  else if (password.length >= 8) score += 20;
  
  // Character type criteria
  if (hasUppercase) score += 15;
  if (hasLowercase) score += 15;
  if (hasNumber) score += 15;
  if (hasSpecialChar) score += 15;
  
  // Determine strength level and message
  if (score <= 30) {
    return {
      score: Math.min(score, 33),
      message: "Weak – Add more character types and length",
      color: "bg-red-500/20"
    };
  } else if (score <= 70) {
    return {
      score: Math.min(score, 66),
      message: "Medium – Add more character types or length",
      color: "bg-yellow-500/20"
    };
  } else {
    return {
      score: 100,
      message: "Strong – Great password!",
      color: "bg-green-500/20"
    };
  }
};