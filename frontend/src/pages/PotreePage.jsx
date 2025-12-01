import { useState, useEffect } from "react";
import PotreeViewer from "../components/PotreeViewer.jsx";
import UploadModal from "../components/UploadModal.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { BASE_API_URL } from "../scripts/config.js";

export default function PotreePage() {
  const [pointClouds, setPointClouds] = useState({}); // now an object { status: [names] }
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

  useEffect(() => {
    fetchPointClouds();

    const intervalId = setInterval(fetchPointClouds, 10000);
    return () => clearInterval(intervalId);
  }, []);

  // Flatten the status-object into an array with status info: [{name, status}, ...]
  const pointCloudList = Object.entries(pointClouds).flatMap(([status, names]) =>
    names.map((name) => ({ name, status }))
  );

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden app-surface text-foreground">
      <div className="max-w-[98%] mx-auto px-3 md:px-4 py-4 h-full">
        <div className="app-frame p-3 md:p-4 h-full flex">
          {/* Left Sidebar */}
          <aside className="w-64 bg-gray-100 border border-gray-300 rounded-md overflow-y-auto relative">
            <h2 className="p-4 font-semibold text-lg border-b border-gray-300">
              Point Clouds
            </h2>

            {pointCloudList.length === 0 ? (
              <p className="p-4 text-gray-500">No point clouds available.</p>
            ) : (
              <ul>
                {pointCloudList.map(({ name, status }) => (
                  <li
                    key={name}
                    className={`cursor-pointer px-4 py-2 flex justify-between items-center hover:bg-gray-300 ${selectedPointCloud === name ? "bg-gray-300 font-bold" : ""
                      }`}
                    onClick={() => { if (status === 'successful') setSelectedPointCloud(name) }}
                  >
                    <span>{name}</span>
                    <StatusBadge status={status} />
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

          {/* Right Content Area */}
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