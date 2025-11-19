import React from "react";
import PotreeViewer from "@/components/PotreeViewer";

export default function PotreePage() {
  const pointcloudName = "Palac_Moszna";

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden app-surface text-foreground">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 h-full">
        <div className="app-frame p-8 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <PotreeViewer pointcloudName={pointcloudName} />
          </div>
        </div>
      </div>
    </div>
  );
}
