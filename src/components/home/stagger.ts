// A plain helper with no "use client" marker, so server components can call it.
// It is kept apart from reveal.tsx because everything exported from a client
// file becomes a client reference on the server.

// Small stagger so a row of cards does not appear all at once.
export function staggerDelay(index: number, columns = 3) {
  return (index % columns) * 0.08;
}
