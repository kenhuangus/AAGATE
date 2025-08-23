import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
  );
}
