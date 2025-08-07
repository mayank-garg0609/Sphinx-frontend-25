import React, { memo, useMemo } from "react";

interface ProfileAvatarProps {
  name: string;
}

export const ProfileAvatar = memo(function ProfileAvatar({ name }: ProfileAvatarProps) {
  const initials = useMemo(() => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }, [name]);

  return (
    <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
      <span className="text-2xl lg:text-3xl font-bold text-white">
        {initials}
      </span>
    </div>
  );
});