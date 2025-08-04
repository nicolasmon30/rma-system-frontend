import { useState } from "react";
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import Sidebar from './Sidebar';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="app-layout">
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="content-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}