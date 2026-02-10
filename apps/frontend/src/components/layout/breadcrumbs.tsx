import { Link, useLocation } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export function Breadcrumbs() {
  // ne récup!re que le path de l'objet retourné
  const path = useLocation({
    select: (location) => location.pathname,
  });

  const segmentArray = path.split("/").filter(Boolean);
  const segments = segmentArray.map((segment, index) => {
    const name = segment.charAt(0).toUpperCase() + segment.slice(1);
    const path = "/" + segmentArray.slice(0, index + 1).join("/");
    return { name, path };
  });

  return (
    <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <Link to="/" className="hover:text-green-700 flex items-center gap-1">
        <Home size={16} />
        Home
      </Link>
      {segments.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-2">
          <ChevronRight size={16} />
          {index === segments.length - 1 ? (
            <span className="text-gray-900 font-medium">{crumb.name}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-green-700">
              {crumb.name}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
