"use client";
import { useEffect, useState } from "react";
import FailureLibrary from "@/components/FailureLibraryDynamic";
import type { FailedStartup } from "@/types";

export default function FailuresPage() {
  const [failures, setFailures] = useState<FailedStartup[]>([]);

  useEffect(() => {
    fetch("/api/failures")
      .then((r) => r.json())
      .then((data) => {
        if (data.failures && data.failures.length > 0) {
          setFailures(data.failures as FailedStartup[]);
        }
      })
      .catch(() => {
        // fallback to mock data already set
      });
  }, []);

  return (
    <div
      className="min-h-screen px-4 py-6 sm:px-6 sm:py-8"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <h1
        className="text-xl sm:text-2xl font-semibold mb-6"
        style={{ color: "rgba(255,255,255,0.95)" }}
      >
        Failure Library
      </h1>
      <FailureLibrary failures={failures} />
    </div>
  );
}
