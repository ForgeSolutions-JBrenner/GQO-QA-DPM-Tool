import React from "react";
import Link from "next/link";

export default function Instructions() {
  return (
    <div className="p-4 ml-4">
      <ol className="list-decimal">
        <li>
          {" "}
          Download{" "}
          <a
            className="underline text-blue-600"
            href="https://stryker.sharepoint.com/:x:/r/sites/sqdpm/Shared%20Documents/Supporting%20Documents/Upload%20File.xlsx?web=0"
          >
            Template{" "}
          </a>{" "}
        </li>
        <li>
        Enter your months data extracted from your ERP System
        </li>
      </ol>
    </div>
  );
}
