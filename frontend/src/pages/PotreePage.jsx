import React from "react";
import PotreeViewer from "@/components/PotreeViewer";

export default function PotreePage() {
  const pointcloudName = "Palac_Moszna";

  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden app-surface text-foreground">
      <div className="max-w-[98%] mx-auto px-3 md:px-4 py-4 h-full">
        <div className="app-frame p-3 md:p-4 h-full flex items-center justify-center">
          <div className="w-full h-full">
            <PotreeViewer pointcloudName={pointcloudName} />
          </div>
        </div>
      </div>
    </div>
  );
}
