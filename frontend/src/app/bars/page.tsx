import { Suspense } from "react";
import BarsPageContent from "@/components/BarsPageContent";

function BarsPageLoading() {
  return (
    <div className="min-h-screen bg-kalshi-bg flex items-center justify-center">
      <div className="text-kalshi-text-secondary">Loading...</div>
    </div>
  );
}

export default function BarsPage() {
  return (
    <Suspense fallback={<BarsPageLoading />}>
      <BarsPageContent />
    </Suspense>
  );
}
