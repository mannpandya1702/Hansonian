"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";

export default function SidebarWrapper() {
  // Start closed on mobile — lg: always visible via CSS translate
  const [isOpen, setIsOpen] = useState(false);
  return <Sidebar isOpen={isOpen} closeSidebar={() => setIsOpen(false)} />;
}