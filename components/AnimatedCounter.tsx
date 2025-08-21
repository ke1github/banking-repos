"use client";

import React, { useRef, useEffect, useState } from "react";
import CountUp from "react-countup";

interface AnimatedCounterProps {
  start?: number;
  end: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  className?: string;
  onEnd?: () => void;
  onStart?: () => void;
  enableScrollSpy?: boolean;
  scrollSpyDelay?: number;
  preserveValue?: boolean;
}

/**
 * AnimatedCounter - A reusable animated counter component
 *
 * @param start - Starting value (default: 0)
 * @param end - Ending value (required)
 * @param duration - Animation duration in seconds (default: 2.5)
 * @param decimals - Number of decimal places (default: 0)
 * @param prefix - Text to display before the number (e.g., "$")
 * @param suffix - Text to display after the number (e.g., "%")
 * @param separator - Thousands separator (default: ",")
 * @param className - Additional CSS classes
 * @param onEnd - Callback function when animation completes
 * @param onStart - Callback function when animation starts
 * @param enableScrollSpy - Enable animation when scrolled into view
 * @param scrollSpyDelay - Delay before animation starts after scrolling into view (ms)
 * @param preserveValue - Keep the end value when component re-renders
 */
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  start = 0,
  end,
  duration = 2.5,
  decimals = 0,
  prefix = "",
  suffix = "",
  separator = ",",
  className = "",
  onEnd,
  onStart,
  enableScrollSpy = false,
  scrollSpyDelay = 0,
  preserveValue = true,
}) => {
  const counterRef = useRef<HTMLSpanElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Set isClient to true once component mounts (client-side)
    setIsClient(true);
  }, []);

  // Don't render CountUp until we're on the client side and have a valid ref
  if (!isClient) {
    // Return a placeholder with the end value
    return (
      <span className={className}>
        {prefix}
        {typeof end === "number"
          ? end.toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })
          : "0"}
        {suffix}
      </span>
    );
  }

  return (
    <span className={className} ref={counterRef}>
      <CountUp
        start={start}
        end={end}
        duration={duration}
        decimals={decimals}
        prefix={prefix}
        suffix={suffix}
        separator={separator}
        onEnd={onEnd}
        onStart={onStart}
        enableScrollSpy={enableScrollSpy}
        scrollSpyDelay={scrollSpyDelay}
        preserveValue={preserveValue}
        redraw={false}
      />
    </span>
  );
};

export default AnimatedCounter;
