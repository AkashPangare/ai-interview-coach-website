import { Link } from "react-router-dom";
import { WhistleIcon } from "./WhistleIcon";

interface BrandLogoProps {
  className?: string;
  iconBoxClassName?: string;
  iconClassName?: string;
  textClassName?: string;
  showText?: boolean;
  to?: string;
}

export function BrandLogo({
  className = "",
  iconBoxClassName = "",
  iconClassName = "",
  textClassName = "",
  showText = true,
  to,
}: BrandLogoProps) {
  const content = (
    <div className={`flex items-center gap-2.5 group shrink-0 ${className}`}>
      <div
        className={`h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-sky-500 flex items-center justify-center shadow-md shadow-blue-500/25 text-white group-hover:scale-105 transition-transform p-1.5 ${iconBoxClassName}`}
      >
        <WhistleIcon className={`w-full h-full text-white ${iconClassName}`} />
      </div>
      {showText && (
        <span
          className={`text-lg font-black tracking-tight text-slate-900 ${textClassName}`}
        >
          Prep<span className="text-blue-600">Visor</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
