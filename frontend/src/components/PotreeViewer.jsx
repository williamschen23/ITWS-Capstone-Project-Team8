import { BASE_API_URL } from "../scripts/config.js";

export default function PotreeViewer({ pointcloudName }) {
  return (
    <iframe
      src={`${BASE_API_URL}/viewer/${pointcloudName}`}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      title={`Potree Viewer - ${pointcloudName}`}
    />
  );
}