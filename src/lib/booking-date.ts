import { fromZonedTime } from "date-fns-tz";
import { startOfDay } from "date-fns";

const TZ = "America/Regina";

export function parseEventDateTime(dateStr: string, timeStr: string): Date {
  const isoLocal = `${dateStr}T${timeStr}:00`;
  return fromZonedTime(isoLocal, TZ);
}

export function isPastEventDate(dateStr: string): boolean {
  const eventDay = fromZonedTime(`${dateStr}T00:00:00`, TZ);
  const todayStart = startOfDay(fromZonedTime(new Date(), TZ));
  return eventDay < todayStart;
}
