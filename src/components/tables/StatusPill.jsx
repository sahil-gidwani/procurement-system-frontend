import React from "react";
import { classNames } from "./shared/Utils";

function StatusPill({ value }) {
  const status = value ? value.toLowerCase() : "unknown";

  return (
    <span
      className={classNames(
        "leading-wide rounded-full px-3 py-1 text-xs font-bold uppercase shadow-sm",
        status.startsWith("active") ? "bg-green-100 text-green-800" : null,
        status.startsWith("inactive") ? "bg-yellow-100 text-yellow-800" : null,
        status.startsWith("offline") ? "bg-red-100 text-red-800" : null,
      )}
    >
      {status}
    </span>
  );
}

export default StatusPill;
