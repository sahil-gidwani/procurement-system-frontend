import React from "react";
import { classNames } from "./shared/Utils";

function StatusPill({ value, colorMap }) {
  const status = value ? value.toLowerCase() : "unknown";
  
  const { backgroundColor, textColor } = colorMap[status] || {
    backgroundColor: "bg-gray-100",
    textColor: "text-gray-800"
  };

  return (
    <span
      className={classNames(
        "leading-wide rounded-full px-3 py-1 text-xs font-bold uppercase shadow-sm",
        backgroundColor,
        textColor
      )}
    >
      {status}
    </span>
  );
}

export default StatusPill;
