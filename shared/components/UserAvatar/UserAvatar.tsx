import React from "react";

export interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  shape?: "circle" | "square";
  onlineStatus?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt = "User Avatar",
  size = "md",
  shape = "circle",
  onlineStatus = false,
  className = "",
  children,
}) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-lg",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} ${shapeClasses[shape]} object-cover`}
        />
      ) : (
        <div
          className={`${sizeClasses[size]} ${shapeClasses[shape]} bg-gray-300 flex items-center justify-center`}
        >
          {children || <span className="text-gray-600 text-sm">?</span>}
        </div>
      )}
      {onlineStatus && (
        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
      )}
    </div>
  );
};

export default UserAvatar;
