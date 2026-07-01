// Kiosk auto-reset: after a period of no user interaction, return the app to
// its start screen so the next visitor begins with a clean slate. A full reload
// guarantees a fresh state (prompt, selection, results, animations); the shared
// response cache is deliberately kept, since it holds the pre-cached answers.

const IDLE_MS = 5 * 60 * 1000; // 5 minutes

export default defineNuxtPlugin(() => {
  const router = useRouter();
  let timer: ReturnType<typeof setTimeout> | undefined;

  function resetToStart() {
    if (router.currentRoute.value.path !== "/") {
      window.location.href = "/";
    }
  }

  function schedule() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(resetToStart, IDLE_MS);
  }

  const events = [
    "pointerdown",
    "pointermove",
    "keydown",
    "wheel",
    "touchstart",
    "scroll",
  ];
  for (const event of events) {
    window.addEventListener(event, schedule, { passive: true });
  }
  router.afterEach(schedule);
  schedule();
});
