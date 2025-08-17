"use client";

import dynamic from "next/dynamic";
const UserProfileClient = dynamic(() => import("./UserProfileClient"), {
  ssr: false,
});

export default function ProfilePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <UserProfileClient />
    </div>
  );
}
