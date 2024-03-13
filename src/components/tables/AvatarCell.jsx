import React from "react";

function AvatarCell({ value, column, row }) {
  return (
    <div className="flex items-center">
      <div className="h-10 w-10 flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full"
          src={row.original[column.imgAccessor]}
          alt=""
        />
      </div>
      <div className="ml-4">
        <div className="text-sm font-medium text-gray-900">{value}</div>
        <div className="text-sm text-gray-500">
          {row.original[column.emailAccessor]}
        </div>
      </div>
    </div>
  );
}

export default AvatarCell;
