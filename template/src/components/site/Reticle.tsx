/*
  Repères graphiques hérités du gabarit BM3D, dessinés en trait fin.
  - `Crosshair` : repère miniature.
  - `ReticleFrame` : quatre équerres posées aux coins d'un visuel.
*/

export function Crosshair({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v5M12 17v5M2 12h5M17 12h5" />
    </svg>
  );
}

export function ReticleFrame({ className = "" }: { className?: string }) {
  const corner = "absolute h-6 w-6 border-chartreuse";
  return (
    <span aria-hidden="true" className={`pointer-events-none absolute inset-5 ${className}`}>
      <span className={`${corner} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${corner} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${corner} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${corner} bottom-0 right-0 border-b-2 border-r-2`} />
    </span>
  );
}
