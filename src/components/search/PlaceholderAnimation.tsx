import { useState, useEffect } from "react";

export const usePlaceholderAnimation = () => {
  const [placeholder, setPlaceholder] = useState("");
  const words = ["garyvee", "hormozi", "patrickbetdavid"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[currentWordIndex];

    if (isTyping) {
      if (charIndex < currentWord.length) {
        timer = setTimeout(() => {
          setPlaceholder(currentWord.slice(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        }, 150);
      } else {
        timer = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setPlaceholder(currentWord.slice(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        }, 100);
      } else {
        timer = setTimeout(() => {
          setIsTyping(true);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }, 500);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isTyping, currentWordIndex]);

  return placeholder || words[currentWordIndex];
};