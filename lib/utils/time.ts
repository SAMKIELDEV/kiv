export interface LocalNow {
  time: string;
  date: string;
}

function partValue(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((p) => p.type === type)?.value ?? "";
}

export function getLocalNowInTZ(timezone: string, now: Date = new Date()): LocalNow {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const year = partValue(parts, "year");
  const month = partValue(parts, "month");
  const day = partValue(parts, "day");
  let hour = partValue(parts, "hour");
  if (hour === "24") hour = "00";
  const minute = partValue(parts, "minute");

  // TEMP: 1-minute granularity for testing. Revert to 15-min floor before prod.
  const minuteStr = minute;

  return {
    time: `${hour}:${minuteStr}`,
    date: `${year}-${month}-${day}`,
  };
}

export function isValidTimezone(tz: string): boolean {
  if (!tz || typeof tz !== "string") return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
