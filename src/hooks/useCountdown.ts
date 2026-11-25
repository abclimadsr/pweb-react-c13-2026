import { useCallback, useEffect, useState } from "react";

export function useCountdown(initialSeconds: number, totalQuestions: number) {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [questionIndex, setQuestionIndex] = useState<number>(0);

  useEffect(() => {
    if (!isRunning) return;

    const timerId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isRunning]);

  const start = useCallback(() => {
    if (secondsLeft > 0) setIsRunning(true);
  }, [secondsLeft]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    setIsRunning((prev) => (prev ? false : secondsLeft > 0));
  }, [secondsLeft]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  const next = useCallback(() => {
    setIsRunning(false);
    setSecondsLeft(initialSeconds);
    setQuestionIndex((prev) => (prev + 1) % totalQuestions);
  }, [initialSeconds, totalQuestions]);

  return {
    secondsLeft,
    isRunning,
    questionIndex,
    start,
    pause,
    toggle,
    reset,
    next,
  };
}