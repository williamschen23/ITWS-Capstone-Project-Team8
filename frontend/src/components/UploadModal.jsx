import { useState } from "react";

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (!name || !file) {
      setError("Name and LAZ file are required");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".laz")) {
      setError("Only .laz files are supported");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("file", file);

    try {
      setUploading(true);
      const response = await fetch("http://localhost:8080/api/pointclouds/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Upload failed");
      } else {
        onUpload(); // notify parent to refresh list
        onClose();
        setName("");
        setDescription("");
        setFile(null);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Network error");
    } finally {
      setUploading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-96 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 font-bold text-xl"
          onClick={onClose}
          aria-label="Close upload modal"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Upload New Point Cloud</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium" htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium" htmlFor="description">Description</label>
            <textarea
              id="description"
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">LAZ File *</label>
            <div className="flex items-center space-x-2">
              <label
                htmlFor="file"
                className="cursor-pointer bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
              >
                Browse...
              </label>
              <input
                id="file"
                type="file"
                accept=".laz"
                onChange={(e) => setFile(e.target.files[0])}
                disabled={uploading}
                required
                className="hidden"
              />
              <span className="text-gray-700 italic truncate max-w-xs">
                {file ? file.name : "No file selected"}
              </span>
            </div>
          </div>


          {error && <p className="text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}