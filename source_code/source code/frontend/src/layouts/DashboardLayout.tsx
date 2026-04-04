import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between">
        <h1 className="text-xl font-bold text-gray-800">{title}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">User Profile</span>
          <button className="text-sm bg-red-50 text-red-600 px-3 py-1 rounded hover:bg-red-100">
            Logout
          </button>
        </div>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default DashboardLayout;
