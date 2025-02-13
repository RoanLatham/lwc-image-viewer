"use client";

import { useState } from "react";
import { TabConfig } from "@/types";

interface TabsProps {
  tabs: TabConfig[];
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Tabs({
  tabs,
  onTabChange,
  onTabClose,
  onFileUpload,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const handleTabClose = (
    e: React.MouseEvent<HTMLButtonElement>,
    tabId: string
  ) => {
    e.stopPropagation(); // Prevent tab activation when closing
    onTabClose?.(tabId);
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-t-lg">
      <div className="flex-1 flex space-x-2 overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`group px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer
              ${
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:bg-white/50"
              }`}
          >
            <span>{tab.title}</span>
            <button
              onClick={(e) => handleTabClose(e, tab.id)}
              className="p-1 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Close tab"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
      <label
        htmlFor="add-tab-image"
        className="px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-pointer flex items-center"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </label>
      <input
        id="add-tab-image"
        type="file"
        accept="image/*,.tga,.TGA"
        multiple
        className="hidden"
        onChange={onFileUpload}
      />
    </div>
  );
}
