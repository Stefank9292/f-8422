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
  if (password.length >= minLength) score++;
  if (hasUppercase) score++;
  if (hasLowercase) score++;
  if (hasNumber) score++;
  if (hasSpecialChar) score++;

  if (score < 3) {
    return {
      score: (score / 5) * 100,
      message: "Weak – Password must include uppercase, lowercase, numbers, and special characters",
      color: "bg-red-500/80"
    };
  } else if (score < 5) {
    return {
      score: (score / 5) * 100,
      message: "Medium – Password could be stronger",
      color: "bg-yellow-500/80"
    };
  } else {
    return {
      score: 100,
      message: "Strong – Password meets all requirements",
      color: "bg-green-500/80"
    };
  }
};