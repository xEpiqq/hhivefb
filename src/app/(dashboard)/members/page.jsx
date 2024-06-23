"use client";
import MemberCard from "@/components/MemberCard";
import { ChoirContext } from "../../../components/ChoirContext";
import { useState, useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import MemberSlidePanel from "@/components/MemberSidePanel";

export default function Example() {
  const choir = useContext(ChoirContext);
  const [isLoading, setIsLoading] = useState(true);
  const [inputBox, setInputBox] = useState("");
  const [role, setRole] = useState("Member");
  const [memberDetailsPanelOpen, setMemberDetailsPanelOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  async function sendInvite() {
    if (role === "Member") {
      sendMemberInvite();
    }
    if (role === "Admin") {
      sendAdminInvite();
    }
  }

  async function sendAdminInvite() {
    const choirCode = choir.choirCode;
    const choirName = choir.name;
    const choirId = choir.choirId;

    const response = await fetch("/api/sendadmininvite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputBox, choirName, choirCode, choirId }),
    });

    if (!response.ok) {
      throw new Error("Failed to send admin invite email");
    }
    const data = await response.json();
    alert("Invite email sent. Check spam folder if not in inbox.");
    return data;
  }

  async function sendMemberInvite() {
    const choirCode = choir.choirCode;
    const choirName = choir.name;
    const choirId = choir.choirId;

    const response = await fetch("/api/sendmemberinvite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputBox, choirName, choirCode, choirId }),
    });

    if (!response.ok) {
      throw new Error("Failed to send member invite email");
    }

    const data = await response.json();
    alert("Invite email sent. Check spam folder if not in inbox.");

    return data;
  }

  useEffect(() => {
    if (choir.members) {
      setIsLoading(false);
    }
  }, [choir.members]);

  return (
    <div className="mx-auto sm:max-w-3x relative">
      <MemberSlidePanel
        member={selectedMember}
        setOpen={setMemberDetailsPanelOpen}
        open={memberDetailsPanelOpen}
      />
      <div>
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0z"
            />
          </svg>
          <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">
            Members of <span className="font-bold">{choir.name}</span>
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add members with code{" "}
            <span className="text-indigo-600 font-black">
              {choir.choirCode}
            </span>{" "}
            or through email invite
          </p>
        </div>
        <form className="mt-6 sm:flex sm:items-center">
          <label htmlFor="emails" className="sr-only">
            Email addresses
          </label>
          <div className="grid grid-cols-1 sm:flex-auto">
            <input
              type="text"
              name="emails"
              id="emails"
              className="peer relative col-start-1 row-start-1 border-0 bg-transparent py-3 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 outline-none foc"
              placeholder="Enter an email"
              value={inputBox}
              onChange={(e) => setInputBox(e.target.value)}
            />
            <div
              className="col-start-1 col-end-3 row-start-1 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 peer-focus:ring-2 peer-focus:ring-indigo-600"
              aria-hidden="true"
            />
            <div className="col-start-2 row-start-1 flex items-center">
              <span
                className="h-4 w-px flex-none bg-gray-200"
                aria-hidden="true"
              />
              <label htmlFor="role" className="sr-only">
                Role
              </label>
              <select
                id="role"
                name="role"
                className="rounded-md border-0 bg-transparent py-1.5 pl-4 pr-7 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Member</option>
                <option>Admin</option>
              </select>
            </div>
          </div>
          <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
            <button
              className="block w-full rounded-md bg-indigo-600 px-3 py-3.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={sendInvite}
            >
              Send invite
            </button>
          </div>
        </form>
      </div>
      <div className="mt-10 w-full">
        <h3 className="text-sm font-medium text-gray-500">
          Current Choir Members In{" "}
          <span className="font-bold">{choir.name}</span>
        </h3>
        <ul role="list" className="mt-4 flex flex-col gap-3">
          {isLoading
            ? Array.from({ length: 2 }).map((_, idx) => (
                <li key={idx}>
                  <Skeleton height={50} borderRadius={20} />
                </li>
              ))
            : choir.members.map((member, personIdx) => (
                <MemberCard
                  key={personIdx}
                  member={member}
                  onClick={() => {
                    setSelectedMember(member);
                    setMemberDetailsPanelOpen(true);
                  }}
                />
              ))}
        </ul>
      </div>
    </div>
  );
}
