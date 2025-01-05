import { useState, useEffect } from "react";

export const usePlaceholderAnimation = () => {
  const [placeholder, setPlaceholder] = useState("");
  const words = ["garyvee", "hormozi", "patrickbetdavid"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[currentWordIndex];

    if (charIndex < currentWord.length) {
      timer = setTimeout(() => {
        setPlaceholder(currentWord.slice(0, charIndex + 1));
        setCharIndex(prev => prev + 1);
      }, 150);
    } else {
      timer = setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
        setCharIndex(0);
        setPlaceholder("");
      }, 1500);
    }

    return () => clearTimeout(timer);
  }, [charIndex, currentWordIndex]);

  return placeholder || words[currentWordIndex];
};