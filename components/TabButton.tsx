
import React from 'react';

interface TabButtonProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, icon, isActive, onClick }) => {
  const baseClasses = "flex items-center justify-center w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900";
  const activeClasses = "bg-indigo-600 text-white shadow-lg";
  const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white";

  return (
    <button
      type="button"
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );
};

export default TabButton;
