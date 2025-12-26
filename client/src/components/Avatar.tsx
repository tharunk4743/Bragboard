import React, { useState } from "react";
import { API_BASE_URL } from "../services/apiService";

type Props = {
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  src?: string | null;
  alt?: string;
};

const COLORS = [
  "bg-indigo-600",
  "bg-rose-600",
  "bg-emerald-600",
  "bg-amber-600",
  "bg-sky-600",
  "bg-violet-600",
  "bg-fuchsia-600",
  "bg-rose-500",
];

function stringToColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

const SIZE_MAP: Record<NonNullable<Props["size"]>, string> = {
  xs: "w-5 h-5 text-[10px]",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-32 h-32 text-4xl",
};

const Avatar: React.FC<Props> = ({ name, size = "md", className = "", src, alt }) => {
  const [imgError, setImgError] = useState(false);
  const initialRaw = (name || "").toString().trim();
  const initial = initialRaw ? initialRaw.charAt(0).toUpperCase() : "?";
  const bg = name ? stringToColor(name) : "bg-slate-400";
  const sizeCls = SIZE_MAP[size];

  let finalSrc: string | undefined = undefined;
  if (src) {
    // if the backend returns a relative /media path, prefix with the API base URL
    finalSrc = src.startsWith("/") ? `${API_BASE_URL}${src}` : src;
  }

  return (
    <div
      className={`relative overflow-hidden rounded-full font-bold text-white ${sizeCls} ${bg} ${className}`.trim()
      }
      aria-hidden
    >
      {finalSrc && !imgError ? (
        <img
          src={finalSrc}
          alt={alt || name || "avatar"}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          {initial ? <span>{initial}</span> : null}
        </div>
      )}
    </div>
  );
};

export default Avatar;
