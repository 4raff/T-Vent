export default function LoadingSkeleton({ count = 6, variant = "card" }) {
  if (variant === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow animate-pulse">
            <div className="h-48 bg-gray-300 rounded-t-lg"></div>
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-300 rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className="space-y-4">
        <div className="h-12 bg-gray-300 rounded w-1/3"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
