import { useEffect, useState } from "react";

export default function AnimatedNumber({
  value,
  duration = 900,
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const numericValue = Number(
      String(value).replace(/,/g, "")
    );

    if (Number.isNaN(numericValue)) {
      setDisplayValue(value);
      return;
    }

    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased =
        1 - Math.pow(1 - progress, 3);

      const current =
        Math.floor(numericValue * eased);

      setDisplayValue(
        current.toLocaleString()
      );

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{displayValue}</>;
}