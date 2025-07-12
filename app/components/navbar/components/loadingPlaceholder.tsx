import React from "react";

interface LoadingPlaceholderProps {
  className?: string;
}

export const LoadingPlaceholder: React.FC<LoadingPlaceholderProps> = ({
  className,
}) => <div className={`bg-gray-400 rounded animate-pulse ${className}`} />;
