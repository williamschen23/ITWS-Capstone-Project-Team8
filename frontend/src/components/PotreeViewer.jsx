export default function PotreeViewer({ pointcloudName }) {
  return (
    <iframe
      src={`http://127.0.0.1:8080/viewer/${pointcloudName}`}
      style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
      title={`Potree Viewer - ${pointcloudName}`}
    />
  );
}