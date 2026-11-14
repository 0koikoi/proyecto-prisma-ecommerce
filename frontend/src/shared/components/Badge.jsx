const BADGE_VARIANTS = {
  neutral: 'badge-neutral',
  ice: 'badge-ice',
  emerald: 'badge-emerald',
  amber: 'badge-amber',
  rose: 'badge-rose',
  purple: 'badge-purple',
  cyan: 'badge-cyan',
};

export function Badge({ children, variant = 'neutral', className = '', ...props }) {
  const variantClass = BADGE_VARIANTS[variant] || BADGE_VARIANTS.neutral;

  return (
    <span className={`badge ${variantClass} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
