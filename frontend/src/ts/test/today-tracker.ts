import { createSignal } from "solid-js";

import { getLocalResults } from "../stores/local-results";
import * as DateTime from "../utils/date-and-time";

const [seconds, setSeconds] = createSignal(0);
// whether seconds started from today's saved results, not this session
const [addedAllToday, setAddedAllToday] = createSignal(false);
// local midnight of the day being counted
let todayStart: number;

function startOfDay(ms: number): number {
  const date = new Date(ms);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** A finished test's seconds (afk excluded). */
export function addSeconds(s: number): void {
  if (addedAllToday()) {
    const nowStart = startOfDay(Date.now());
    // a new day (or month, or year): count from this test
    if (nowStart > todayStart) {
      todayStart = nowStart;
      setSeconds(s);
      return;
    }
  }
  setSeconds((current) => current + s);
}

/** Time typed today, eg. "05:12 today". Reactive. */
export function getTimeTodayString(): string {
  const secString = DateTime.secondsToString(Math.round(seconds()), true, true);
  return secString + (addedAllToday() ? " today" : " session");
}

/** Starts the count from today's results saved in this browser. */
export function addAllFromToday(): void {
  todayStart = startOfDay(Date.now());
  const secondsToday = getLocalResults()
    .filter((result) => result.timestamp >= todayStart)
    .reduce((sum, result) => sum + result.testDuration - result.afkDuration, 0);
  setSeconds(secondsToday);
  setAddedAllToday(true);
}
