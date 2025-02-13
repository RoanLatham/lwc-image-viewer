"use client";

import { useState } from "react";
import ImageViewer from "@/components/ImageViewer/ImageViewer";
import Tabs from "@/components/Tabs/Tabs";
import { TabConfig, ImageViewerState } from "@/types";

export default function Home() {
  const [tabs, setTabs] = useState<TabConfig[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleStateChange = (state: ImageViewerState) => {
    if (!activeTabId) return;
    // Prevent unnecessary updates if state hasn't changed
    const currentTab = tabs.find((tab) => tab.id === activeTabId);
    if (JSON.stringify(currentTab?.state) === JSON.stringify(state)) {
      return;
    }

    setTabs((prevTabs) =>
      prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, state } : tab))
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    let lastTabId: string | null = null;

    // Process files sequentially to maintain order
    Array.from(files).forEach((file) => {
      const imageUrl = URL.createObjectURL(file);
      const newTab: TabConfig = {
        id: crypto.randomUUID(),
        title: file.name,
        imageUrl,
        imageFile: file,
        state: {
          channels: { red: true, green: true, blue: true, alpha: true },
          zoom: 1,
          position: { x: 0, y: 0 },
          rotation: 0,
        },
      };

      lastTabId = newTab.id;
      setTabs((prevTabs) => [...prevTabs, newTab]);
    });

    // Set the last tab as active after all tabs are added
    if (lastTabId) {
      setActiveTabId(lastTabId);
    }
  };

  const handleTabClose = (tabId: string) => {
    setTabs((prevTabs) => {
      const newTabs = prevTabs.filter((tab) => tab.id !== tabId);

      // If we're closing the active tab, activate the next available tab
      if (tabId === activeTabId) {
        const closedTabIndex = prevTabs.findIndex((tab) => tab.id === tabId);
        const nextTab = newTabs[closedTabIndex] || newTabs[closedTabIndex - 1];
        setActiveTabId(nextTab?.id || null);
      }

      // Clean up the URL object to prevent memory leaks
      const closedTab = prevTabs.find((tab) => tab.id === tabId);
      if (closedTab?.imageUrl) {
        URL.revokeObjectURL(closedTab.imageUrl);
      }

      return newTabs;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Only hide overlay if we're leaving the window
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const supportedFiles = files.filter((file) => {
      const type = file.type.toLowerCase();
      const name = file.name.toLowerCase();
      return (
        type.startsWith("image/") || // Standard image types
        name.endsWith(".tga") // TGA files
      );
    });

    let lastTabId: string | null = null;

    supportedFiles.forEach((file) => {
      const imageUrl = URL.createObjectURL(file);
      const newTab: TabConfig = {
        id: crypto.randomUUID(),
        title: file.name,
        imageUrl,
        imageFile: file,
        state: {
          channels: { red: true, green: true, blue: true, alpha: true },
          zoom: 1,
          position: { x: 0, y: 0 },
          rotation: 0,
        },
      };

      lastTabId = newTab.id;
      setTabs((prevTabs) => [...prevTabs, newTab]);
    });

    // Set the last tab as active after all tabs are added
    if (lastTabId) {
      setActiveTabId(lastTabId);
    }

    // Show feedback if any files were unsupported
    const unsupportedCount = files.length - supportedFiles.length;
    if (unsupportedCount > 0) {
      alert(`${unsupportedCount} file(s) were not supported image formats.`);
    }
  };

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  return (
    <>
      {isDragging && (
        <>
          <div className="fixed inset-0 bg-blue-500/10 backdrop-blur-sm pointer-events-none z-50" />
          <div className="fixed inset-4 border-2 border-dashed border-blue-300 rounded-lg pointer-events-none z-50" />
          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-800">
                Drop images here
              </h2>
              <p className="text-gray-600 mt-2">
                Release to add images to viewer
              </p>
            </div>
          </div>
        </>
      )}
      <main
        className={`min-h-screen p-4 bg-gray-50 transition-all duration-300 ${
          tabs.length > 0 ? "pt-2" : "flex items-center justify-center"
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 ${
            tabs.length > 0
              ? "w-[95vw] h-[90vh] max-w-[2000px] mt-2 mx-auto"
              : "w-full max-w-4xl"
          }`}
        >
          {tabs.length > 0 ? (
            <div className="flex flex-col h-full">
              <Tabs
                tabs={tabs}
                activeTabId={activeTabId}
                onTabChange={setActiveTabId}
                onTabClose={handleTabClose}
                onFileUpload={handleFileUpload}
              />
              {activeTab && (
                <div className="flex-1 p-4 min-h-0">
                  <ImageViewer
                    key={activeTab.id}
                    imageUrl={activeTab.imageUrl}
                    imageFile={activeTab.imageFile}
                    initialState={activeTab.state}
                    onStateChange={handleStateChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center relative">
              <div className="relative">
                <h1 className="text-3xl font-bold mb-4 text-gray-800">
                  Welcome to LWC Image Viewer
                </h1>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  This application allows you to view images and manipulate
                  their color channels. Upload an image to get started.
                </p>
                <div className="space-y-4">
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Upload Image
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,.tga,.TGA"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="text-sm text-gray-500">
                    Supported formats: JPG, PNG, GIF, WebP, TGA
                  </div>
                  <div className="text-sm text-gray-500">
                    Or drag and drop images anywhere
                  </div>
                </div>
                <div className="mt-8 p-6 bg-gray-50 rounded-lg max-w-2xl mx-auto">
                  <h2 className="text-xl font-semibold mb-4 text-gray-700">
                    Features
                  </h2>
                  <ul className="text-left text-gray-600 space-y-2">
                    <li>• Toggle individual color channels (RGBA)</li>
                    <li>• Pan and zoom controls</li>
                    <li>• Multiple image tabs</li>
                    <li>• Toggle color or grayscale display</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
