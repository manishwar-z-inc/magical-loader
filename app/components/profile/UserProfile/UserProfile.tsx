"use client";

// UserProfile.tsx
import React, { useState, useEffect } from "react";
import MagicalSkeletonLoader from "@/app/components/ui/MagicalSkeletonLoader";

interface User {
  name: string;
  avatar: string;
  bio: string;
}

const UserProfile: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Simulate an asynchronous API call.
    setTimeout(() => {
      setUser({
        name: "Jane Doe",
        avatar: "https://placehold.co/100",
        bio: "Enthusiastic developer and designer.",
      });
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <MagicalSkeletonLoader loading={loading}>
      <div className="max-w-sm mx-auto p-4">
        <img
          src={user?.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full mx-auto"
        />
        <img
          src={user?.avatar}
          alt="Avatar"
          className="w-24 h-24 rounded-full mx-auto mt-4"
        />
        <h2 className="mt-4 text-center text-xl font-bold">{user?.name}</h2>
        <p className="mt-2 text-center text-gray-700">{user?.bio}</p>
      </div>
    </MagicalSkeletonLoader>
  );
};

export default UserProfile;
