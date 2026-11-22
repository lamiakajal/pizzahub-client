// Kept out of reveal.tsx so server components can import it.
export function staggerDelay(index: number, columns = 3) {
  return (index % columns) * 0.08;
}
