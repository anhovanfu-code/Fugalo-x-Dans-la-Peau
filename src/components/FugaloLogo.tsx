import React from "react";

interface LogoProps {
  className?: string; // Optional custom tailwind classes for the container
  size?: number;      // Height in pixels for the seal
}

/**
 * Authentic hand-carved terracotta stamp seal representing the official seal of Fugalo.
 * Dynamically cropped from the official branding logo for precise replication.
 */
export function FugaloSeal({ className = "", size = 48 }: LogoProps) {
  return (
    <div 
      className={`overflow-hidden select-none shrink-0 inline-block relative rounded-md ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="https://fugalo.com.vn/uploads/logo-fugalo.png"
        alt="Fugalo Seal"
        referrerPolicy="no-referrer"
        className="absolute top-0 left-0 h-full max-w-none object-contain pointer-events-none"
        style={{ height: size, width: "auto" }}
      />
    </div>
  );
}

interface BrandProps extends LogoProps {
  textColorClasses?: string; // Optional custom text coloring classes
  subtitleColorClasses?: string;
  hideSubtitle?: boolean;
}

/**
 * Beautiful full brand mark representing Fugalo (Seal + Serif Text + Subtitle),
 * loaded directly from the official branding asset URL.
 */
export function FugaloBrand({
  className = "",
  size = 48,
  textColorClasses = "text-stone-900",
  subtitleColorClasses = "text-stone-500",
  hideSubtitle = false,
}: BrandProps) {
  // If subtitle is hidden, we might want to just show the cropped seal plus text,
  // but since we want the actual premium logo from the official asset, we'll render the full official brand image!
  return (
    <img
      src="https://fugalo.com.vn/uploads/logo-fugalo.png"
      alt="Fugalo Brand Logo"
      referrerPolicy="no-referrer"
      className={`object-contain select-none shrink-0 pointer-events-none ${className}`}
      style={{ height: size, width: "auto" }}
    />
  );
}
