import { useState, useEffect } from "react";

export function useSafeTimeFormat(
  date: Date,
  locale: string = "en-IN"
): string {
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const updateTime = () => {
        try {
          setFormattedTime(
            date.toLocaleTimeString(locale, {
              timeZone: "Asia/Kolkata",
              hour12: true,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          );
        } catch {
          // Fallback to simple format
          setFormattedTime(date.toLocaleTimeString());
        }
      };

      updateTime();

      // Update every second to show live time
      const interval = setInterval(updateTime, 1000);

      return () => clearInterval(interval);
    }
  }, [date, locale, isClient]);

  // Return empty string during SSR to avoid hydration mismatch
  return isClient ? formattedTime : "";
}

export function useRelativeTime(date: Date): string {
  const [relativeTime, setRelativeTime] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const updateRelativeTime = () => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);

        if (diffSeconds < 30) {
          setRelativeTime("just now");
        } else if (diffSeconds < 60) {
          setRelativeTime(`${diffSeconds}s ago`);
        } else if (diffMinutes < 60) {
          setRelativeTime(`${diffMinutes}m ago`);
        } else {
          setRelativeTime("over 1h ago");
        }
      };

      updateRelativeTime();

      // Update every 10 seconds for relative time
      const interval = setInterval(updateRelativeTime, 10000);

      return () => clearInterval(interval);
    }
  }, [date, isClient]);

  return isClient ? relativeTime : "";
}
