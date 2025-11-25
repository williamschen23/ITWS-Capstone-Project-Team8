export default function StatusBadge({ status }) {
  const colorMap = {
    pending: "bg-yellow-200 text-yellow-800",
    processing: "bg-blue-200 text-blue-800",
    successful: "bg-green-200 text-green-800",
    error: "bg-red-200 text-red-800",
    unknown: "bg-gray-200 text-gray-800",
  };
  const labelMap = {
    pending: "Pending",
    processing: "Processing",
    successful: "Successful",
    error: "Error",
    unknown: "Unknown",
  };

  const className = `inline-block px-2 py-0.5 rounded text-xs font-semibold ${colorMap[status] || colorMap.unknown}`;
  return <span className={className}>{labelMap[status] || labelMap.unknown}</span>;
}