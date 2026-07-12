import { useEffect, useState } from "react";

export default function Typewriter({ options = {} }) {
  const {
    strings = [],
    autoStart = true,
    loop = true,
    deleteSpeed = 80,
    delay = 100,
  } = options;

  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!autoStart || !strings.length) return;

    const currentWord = strings[index % strings.length];

    let timeout;

    if (!isDeleting && text.length < currentWord.length) {
      // typing forward
      timeout = setTimeout(
        () => setText(currentWord.slice(0, text.length + 1)),
        delay
      );
    } else if (!isDeleting && text.length === currentWord.length) {
      // short pause at full word
      timeout = setTimeout(() => setIsDeleting(true), 800);
    } else if (isDeleting && text.length > 0) {
      // deleting
      timeout = setTimeout(
        () => setText(currentWord.slice(0, text.length - 1)),
        deleteSpeed
      );
    } else if (isDeleting && text.length === 0) {
      // move to next word
      setIsDeleting(false);
      setIndex((prev) => {
        const next = prev + 1;
        if (!loop && next >= strings.length) return prev;
        return next % strings.length;
      });
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, index, strings, autoStart, loop, deleteSpeed, delay]);

  return (
    <span>
      {text}
      <span style={{ borderRight: "2px solid currentColor", marginLeft: 2 }} />
    </span>
  );
}
