import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import PotreeViewer from "../components/PotreeViewer.jsx";
import UploadModal from "../components/UploadModal.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { BASE_API_URL } from "../scripts/config.js";

// Portal tooltip component for error display
function ErrorTooltip({ error }) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const iconRef = useRef(null);

  useEffect(() => {
    function updatePosition() {
      if (!iconRef.current) return;

      const rect = iconRef.current.getBoundingClientRect();
      setPos({
        top: window.scrollY + rect.top - 8, // 8px above icon
        left: window.scrollX + rect.left + rect.width / 2,
      });
    }

    if (visible) {
      updatePosition();
      window.addEventListener("scroll", updatePosition);
      window.addEventListener("resize", updatePosition);
      window.addEventListener("mousemove", updatePosition);
    }

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("mousemove", updatePosition);
    };
  }, [visible]);

  return (
    <>
      <div
        ref={iconRef}
        className="relative inline-block"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        aria-label="Error info"
        role="img"
      >
        {/* Info icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-600 cursor-pointer"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} fill="none" />
          <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth={2} />
          <circle cx="12" cy="16" r="1" fill="currentColor" />
        </svg>
      </div>

      {visible &&
        createPortal(
          <div
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: "translate(-50%, -100%)",
              maxWidth: "320px",
              zIndex: 9999,
              pointerEvents: "none",
            }}
            className="bg-red-600 text-white text-sm p-2 rounded shadow-lg whitespace-normal break-words"
          >
            {error}
            <div
              style={{
                position: "absolute",
                bottom: "-6px",
                left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                width: "12px",
                height: "12px",
                backgroundColor: "rgb(220 38 38)", // Tailwind red-600
              }}
            />
          </div>,
          document.body
        )}
    </>
  );
}

export default function PotreePage() {
  const [pointClouds, setPointClouds] = useState({});
  const [selectedPointCloud, setSelectedPointCloud] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  async function fetchPointClouds() {
    try {
      const response = await fetch(`${BASE_API_URL}/api/pointclouds`);
      const data = await response.json();
      setPointClouds(data);
    } catch (error) {
      console.error("Error fetching point clouds:", error);
    }
  }

  async function deletePointCloud(name) {
    if (!window.confirm(`Are you sure you want to delete point cloud "${name}"?`)) {
      return false;
    }

    try {
      const response = await fetch(`${BASE_API_URL}/api/pointclouds/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const err = await response.json();
        alert("Delete failed: " + (err.error || "Unknown error"));
        return false;
      }

      await fetchPointClouds();

      if (selectedPointCloud === name) {
        setSelectedPointCloud(null);
      }

      return true;
    } catch (error) {
      alert("Error deleting point cloud: " + error.message);
      return false;
    }
  }

  useEffect(() => {
    fetchPointClouds();
    const intervalId = setInterval(fetchPointClouds, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // Convert API shape: {status: [[name, error], ...]} → unified list
  const pointCloudList = Object.entries(pointClouds).flatMap(([status, entries]) =>
    entries.map(([name, error]) => ({
      name,
      status,
      error,
    }))
  );

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden app-surface text-foreground">
      <div className="max-w-[98%] mx-auto px-3 md:px-4 py-4 h-full">
        <div className="app-frame p-3 md:p-4 h-full flex">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-100 border border-gray-300 rounded-md overflow-y-auto relative">
            <h2 className="p-4 font-semibold text-lg border-b border-gray-300">
              Point Clouds
            </h2>

            {pointCloudList.length === 0 ? (
              <p className="p-4 text-gray-500">No point clouds available.</p>
            ) : (
              <ul>
                {pointCloudList.map(({ name, status, error }) => (
                  <li
                    key={name}
                    className={`
                      px-4 py-2 flex justify-between items-center hover:bg-gray-300
                      ${selectedPointCloud === name ? "bg-gray-300 font-bold" : ""}
                      ${status !== "successful" ? "opacity-50 cursor-default" : "cursor-pointer"}
                    `}
                    onClick={() => {
                      if (status === "successful") {
                        setSelectedPointCloud(name);
                      }
                    }}
                  >
                    <span>{name}</span>

                    <div className="flex items-center space-x-2">
                      <StatusBadge status={status} />

                      {error && <ErrorTooltip error={error} />}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deletePointCloud(name);
                        }}
                        className="text-black hover:text-gray-700 focus:outline-none opacity-100 cursor-pointer pointer-events-auto"
                        aria-label={`Delete point cloud ${name}`}
                        title="Delete point cloud"
                        type="button"
                      >
                        🗑️
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <button
              onClick={() => setUploadModalOpen(true)}
              className="absolute bottom-2 left-2 right-2 bg-blue-600 text-white rounded py-2 text-center hover:bg-blue-700"
            >
              Upload New File
            </button>
          </aside>

          {/* Main Panel */}
          <main className="flex-1 ml-4 bg-white rounded-md relative">
            {!selectedPointCloud ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-xl">
                Select a point cloud from the left to view
              </div>
            ) : (
              <PotreeViewer pointcloudName={selectedPointCloud} />
            )}
          </main>
        </div>
      </div>

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUpload={fetchPointClouds}
      />
    </div>
  );
}
