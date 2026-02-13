const SmokeFooterEffect = () => {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-0"
      style={{
        background: `radial-gradient(ellipse at center, rgba(168,85,247,0.1) 0%, transparent 80%)`,
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 100%)',
        animation: 'pulse 10s ease-in-out infinite',
        opacity: 0.4,
      }}
    />
  );
};

export default SmokeFooterEffect;
