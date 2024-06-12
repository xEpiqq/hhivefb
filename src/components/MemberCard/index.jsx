import { ChoirContext } from "@/components/ChoirContext";
import { useContext, useState, useEffect } from "react";

export default function MemberCard({ member, key, onClick }) {
  const choir = useContext(ChoirContext);
  return (
    <li key={key}>
      <button
        onClick={onClick}
        type="button"
        className="group flex w-full items-center justify-between space-x-3 rounded-full border border-gray-300 p-2 text-left shadow-sm hover:bg-gray-50"
      >
        <span className="flex min-w-0 flex-1 items-center space-x-3">
          <span className="block flex-shrink-0">
            <img className="h-10 w-10 rounded-full" src={member.image} alt="" />
          </span>
          <span className="block min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-gray-900">
              {member.name}
            </span>
            
          </span>
        </span>
        <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center">
          <span
            className={`inline-flex items-center rounded-full px-2 py-1 mr-6 text-xs font-medium ring-1 ring-inset ${
              member.role === "Member"
                ? "bg-red-50 text-red-700 ring-red-600/20"
                : "bg-green-50 text-green-700 ring-green-600/20"
            }`}
          >
            {member.role}
          </span>
        </span>
      </button>
    </li>
  );
}
