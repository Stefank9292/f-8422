import { useState, useEffect } from "react";

export const usePlaceholderAnimation = () => {
  const [placeholder, setPlaceholder] = useState("");
  const word = "username";
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTyping) {
      if (charIndex < word.length) {
        timer = setTimeout(() => {
          setPlaceholder(word.slice(0, charIndex + 1));
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
          setPlaceholder(word.slice(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        }, 100);
      } else {
        timer = setTimeout(() => {
          setIsTyping(true);
        }, 500);
      }
    }

    return () => clearTimeout(timer);
  }, [charIndex, isTyping]);

  return placeholder || word;
};