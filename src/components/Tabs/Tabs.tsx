"use client";

import { TabConfig } from "@/types";

interface TabsProps {
  tabs: TabConfig[];
  activeTabId: string | null;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onCloseAll?: () => void;
}

export default function Tabs({
  tabs,
  activeTabId,
  onTabChange,
  onTabClose,
  onFileUpload,
  onCloseAll,
}: TabsProps) {
  const handleTabChange = (tabId: string) => {
    onTabChange?.(tabId);
  };

  const handleTabClose = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
    tabId: string
  ) => {
    e.stopPropagation();
    onTabClose?.(tabId);
  };

  const handleTabClick = (
    e: React.MouseEvent<HTMLDivElement>,
    tabId: string
  ) => {
    // Middle click (button 1)
    if (e.button === 1) {
      handleTabClose(e, tabId);
      return;
    }

    // Left click (button 0)
    if (e.button === 0) {
      handleTabChange(tabId);
    }
  };

  return (
    <div className="flex items-center space-x-2 p-3 bg-gray-100 border-b border-gray-200">
      {tabs.length > 0 && (
        <button
          onClick={onCloseAll}
          className="px-3 py-2 rounded-md text-gray-600 hover:bg-white/50 transition-colors flex items-center"
          title="Close all tabs"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 6h10a2 2 0 012 2v10M7 7a2 2 0 00-2 2v10a2 2 0 002 2h8"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 3h10a2 2 0 012 2v10M10 3a2 2 0 00-2 2v1"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 12l4 4m0-4l-4 4"
            />
          </svg>
        </button>
      )}
      <div className="flex-1 flex space-x-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onMouseDown={(e) => handleTabClick(e, tab.id)}
            onAuxClick={(e) => handleTabClick(e, tab.id)}
            className={`group px-4 py-2 rounded-md transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer select-none
              ${
                activeTabId === tab.id
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
