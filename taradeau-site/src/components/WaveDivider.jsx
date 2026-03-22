export default function WaveDivider({ color = 'var(--bg-secondary)', flip = false, variant = 1 }) {
  const paths = {
    1: 'M0,64 C320,120 640,20 960,80 C1280,140 1440,40 1440,40 L1440,0 L0,0 Z',
    2: 'M0,96 C240,20 480,100 720,64 C960,28 1200,96 1440,64 L1440,0 L0,0 Z',
    3: 'M0,48 C180,96 360,16 540,64 C720,112 900,32 1080,80 C1260,128 1440,48 1440,48 L1440,0 L0,0 Z',
  };

  return (
    <div className={`wave-divider${flip ? ' flip' : ''}`} aria-hidden="true">
      <svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={paths[variant] || paths[1]} fill={color} />
      </svg>
    </div>
  );
}
