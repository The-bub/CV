export function onSpotlightMove(e) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--spot-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
  el.style.setProperty("--spot-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
}
