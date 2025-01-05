import { useState, useEffect } from "react";

export const usePlaceholderAnimation = () => {
  const [placeholder, setPlaceholder] = useState("");
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [exampleCharIndex, setExampleCharIndex] = useState(0);
  
  // Ensure the examples are in the exact order specified
  const examples = ["garyvee", "hormozi", "patrickbetdavid"];

  // Handle example usernames typing animation
  useEffect(() => {
    const currentExample = examples[currentExampleIndex];
    
    if (exampleCharIndex === 0) {
      // Start typing the example after a pause
      const startTypingTimer = setTimeout(() => {
        setExampleCharIndex(1);
      }, 1000);
      return () => clearTimeout(startTypingTimer);
    }
    
    if (exampleCharIndex <= currentExample.length) {
      // Type the example character by character
      const typingTimer = setTimeout(() => {
        setPlaceholder(currentExample.slice(0, exampleCharIndex));
        setExampleCharIndex(prev => prev + 1);
      }, 100); // Slightly faster typing speed
      return () => clearTimeout(typingTimer);
    } else {
      // Show complete example for a moment before starting to erase
      const pauseTimer = setTimeout(() => {
        setExampleCharIndex(-1);
      }, 2000); // Longer pause when fully typed
      return () => clearTimeout(pauseTimer);
    }
  }, [currentExampleIndex, exampleCharIndex]);

  // Handle erasing and cycling to next example
  useEffect(() => {
    if (exampleCharIndex !== -1) return;

    const currentExample = examples[currentExampleIndex];
    const erasingTimer = setTimeout(() => {
      if (placeholder === "") {
        // Move to next example
        setCurrentExampleIndex((prev) => (prev + 1) % examples.length);
        setExampleCharIndex(0);
      } else {
        // Erase one character at a time
        setPlaceholder(prev => prev.slice(0, -1));
      }
    }, 50); // Quick erasing speed

    return () => clearTimeout(erasingTimer);
  }, [exampleCharIndex, placeholder, currentExampleIndex, examples]);

  return placeholder;
};