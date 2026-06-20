import Image from "next/image";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
}

export function PageHeader({
  eyebrow = "Evolved Fitness Center 2.0",
  title,
  subtitle,
  image,
}: PageHeaderProps) {
  return (
    <section className="relative h-[46vh] min-h-[320px] w-full bg-[#0d0d0d]">
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(13,13,13,0.6) 0%, transparent 40%, rgba(13,13,13,0.9) 80%, #0d0d0d 100%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to right, rgba(13,13,13,0.6) 0%, transparent 25%, transparent 75%, rgba(13,13,13,0.6) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 flex h-full translate-y-10 flex-col items-start justify-end px-8 lg:px-16 pb-4 max-w-3xl">
        <p className="text-[#9B1C1C] text-xs font-black tracking-[0.4em] uppercase mb-3">
          {eyebrow}
        </p>
        <h1
          className="font-black uppercase leading-none text-white"
          style={{
            fontSize: "clamp(2.2rem, 4.5vw, 4.2rem)",
            textShadow: "0 4px 40px rgba(0,0,0,0.8), 0 1px 0 rgba(0,0,0,0.9)",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-1 text-white/55 text-base max-w-md leading-relaxed"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,1)" }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
