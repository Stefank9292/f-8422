import { useState, useEffect } from "react";

export const usePlaceholderAnimation = () => {
  const [placeholder, setPlaceholder] = useState("Enter Instagram username or profile URL");
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [exampleCharIndex, setExampleCharIndex] = useState(0);
  
  const examples = ["garyvee", "hormozi", "patrickbetdavid"];

  // Handle example usernames typing animation
  useEffect(() => {
    const currentExample = examples[currentExampleIndex];
    
    if (exampleCharIndex === 0) {
      // Start typing the example
      const startTypingTimer = setTimeout(() => {
        setExampleCharIndex(1);
      }, 1000);
      return () => clearTimeout(startTypingTimer);
    }
    
    if (exampleCharIndex <= currentExample.length) {
      // Type the example character by character
      const typingTimer = setTimeout(() => {
        setPlaceholder(`Enter Instagram username or profile URL (e.g., ${currentExample.slice(0, exampleCharIndex)})`);
        setExampleCharIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(typingTimer);
    } else {
      // Show complete example for a moment before starting to erase
      const pauseTimer = setTimeout(() => {
        setExampleCharIndex(-1);
      }, 1500);
      return () => clearTimeout(pauseTimer);
    }
  }, [currentExampleIndex, exampleCharIndex]);

  // Handle erasing and cycling to next example
  useEffect(() => {
    if (exampleCharIndex !== -1) return;

    const currentExample = examples[currentExampleIndex];
    const erasingTimer = setTimeout(() => {
      if (placeholder === "Enter Instagram username or profile URL") {
        // Move to next example
        setCurrentExampleIndex((prev) => (prev + 1) % examples.length);
        setExampleCharIndex(0);
      } else {
        // Erase one character at a time
        setPlaceholder(prev => {
          const withoutExample = prev.replace(` (e.g., ${currentExample})`, '');
          return withoutExample;
        });
      }
    }, 50);

    return () => clearTimeout(erasingTimer);
  }, [exampleCharIndex, placeholder, currentExampleIndex, examples]);

  return placeholder;
};