export function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`break-inside-avoid border-t border-border pt-6 first:border-t-0 first:pt-0 ${className ?? ""}`}>
      <h2 className="font-heading text-base font-semibold text-navy">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
