"use client";

import Image from "next/image";
import { useAuthStore } from "../../store/authStore";

export default function ProfileAvatar() {
  const profile = useAuthStore((state) => state.profile);

  // Use user avatar or fallback
  const avatarSrc =
    profile?.profile_picture ||
    profile?.profilePicture ||
    profile?.avatar ||
    "/default-avatar.png"; // <-- this file must exist in /public

  return (
    <div className="flex items-center gap-2">
      <Image
        src={avatarSrc}
        alt="Profile Avatar"
        width={40}
        height={40}
        className="rounded-full object-cover"
      />
      <span className="text-sm font-medium text-gray-700">
        {profile?.name || "Guest User"}
      </span>
    </div>
  );
}
