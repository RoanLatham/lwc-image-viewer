"use client";

import { useEffect, useRef, useState } from "react";
import { Channel, ImageViewerState } from "@/types";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { loadTGA } from "@/utils/tgaParser";

interface ImageViewerProps {
  imageUrl: string;
  imageFile?: File;
  initialState?: ImageViewerState;
  onStateChange?: (state: ImageViewerState) => void;
}

export default function ImageViewer({
  imageUrl,
  imageFile,
  initialState,
  onStateChange,
}: ImageViewerProps) {
  const [channels, setChannels] = useState<Channel>(
    initialState?.channels || {
      red: true,
      green: true,
      blue: true,
      alpha: true,
    }
  );
  const [colorMode, setColorMode] = useState<"rgb" | "bw">("rgb");
  const [viewerState, setViewerState] = useState({
    zoom: initialState?.zoom || 1,
    position: initialState?.position || { x: 0, y: 0 },
    rotation: initialState?.rotation || 0,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const allChannelsActive = Object.values(channels).every((value) => value);

  // Move state update to a separate effect with proper dependencies
  useEffect(() => {
    if (onStateChange) {
      onStateChange({
        channels,
        ...viewerState,
      });
    }
  }, [channels, viewerState, onStateChange]);

  const applyChannelFilters = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let sourceCanvas: HTMLCanvasElement;

    if (imageFile?.name.toLowerCase().endsWith(".tga")) {
      try {
        sourceCanvas = await loadTGA(imageFile);
      } catch (error) {
        console.error("Error loading TGA file:", error);
        return;
      }
    } else {
      sourceCanvas = document.createElement("canvas");
      const img = new Image();
      img.src = imageUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      sourceCanvas.width = img.width;
      sourceCanvas.height = img.height;
      const sourceCtx = sourceCanvas.getContext("2d")!;
      sourceCtx.drawImage(img, 0, 0);
    }

    canvas.width = sourceCanvas.width;
    canvas.height = sourceCanvas.height;

    const sourceCtx = sourceCanvas.getContext("2d")!;
    const imageData = sourceCtx.getImageData(
      0,
      0,
      sourceCanvas.width,
      sourceCanvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      if (colorMode === "rgb") {
        if (!channels.red) data[i] = 0; // Red
        if (!channels.green) data[i + 1] = 0; // Green
        if (!channels.blue) data[i + 2] = 0; // Blue
        if (!channels.alpha) data[i + 3] = 255; // Alpha
      } else {
        // Black and white mode
        const r = channels.red ? data[i] : 0;
        const g = channels.green ? data[i + 1] : 0;
        const b = channels.blue ? data[i + 2] : 0;
        const activeChannels =
          Number(channels.red) + Number(channels.green) + Number(channels.blue);
        const value = activeChannels ? (r + g + b) / activeChannels : 0;

        data[i] = value; // Red
        data[i + 1] = value; // Green
        data[i + 2] = value; // Blue
        data[i + 3] = channels.alpha ? data[i + 3] : 255; // Alpha
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  useEffect(() => {
    applyChannelFilters();
  }, [channels, imageUrl, colorMode, imageFile]);

  const toggleChannel = (channel: keyof Channel, solo: boolean) => {
    setChannels((prev) => {
      if (solo) {
        return {
          red: channel === "red",
          green: channel === "green",
          blue: channel === "blue",
          alpha: channel === "alpha",
        };
      } else {
        return {
          ...prev,
          [channel]: !prev[channel],
        };
      }
    });
  };

  const toggleAllChannels = () => {
    setChannels((prev) => {
      const newValue = !allChannelsActive;
      return {
        red: newValue,
        green: newValue,
        blue: newValue,
        alpha: newValue,
      };
    });
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <TransformWrapper
        initialScale={1}
        minScale={0.1}
        maxScale={8}
        centerOnInit
      >
        <TransformComponent
          wrapperClass="!w-full !h-full"
          contentClass="!flex !items-center !justify-center !w-full !h-full"
        >
          <div className="flex items-center justify-center w-full h-full p-4">
            <canvas
              ref={canvasRef}
              className="max-w-[95%] max-h-[95%] w-auto h-auto object-contain"
            />
          </div>
        </TransformComponent>
      </TransformWrapper>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="flex gap-2 items-center bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
          <span className="text-sm text-gray-500 mr-1">Display Mode:</span>
          <button
            onClick={() =>
              setColorMode((mode) => (mode === "rgb" ? "bw" : "rgb"))
            }
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
              ${
                colorMode === "rgb"
                  ? "bg-[linear-gradient(in_oklch,red_0%,magenta_25%,blue_50%,cyan_75%,lime_100%)] text-white"
                  : "bg-gradient-to-r from-gray-900 to-gray-100 text-white"
              }`}
            title={`Switch to ${
              colorMode === "rgb" ? "black & white" : "RGB"
            } mode`}
          >
            {colorMode === "rgb" ? (
              <>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path
                    d="M12 12l-4-4m4 4l4-4m-4 4l-4 4m4-4l4 4"
                    strokeWidth="2"
                  />
                </svg>
                <span>RGB</span>
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M4 4h16v16H4z" strokeWidth="2" />
                  <path d="M4 12h16M12 4v16" strokeWidth="2" />
                </svg>
                <span>B&W</span>
              </>
            )}
          </button>
        </div>

        <div className="flex gap-2 items-center bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
          <button
            onClick={toggleAllChannels}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
              ${
                allChannelsActive
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            All
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          {Object.entries(channels).map(([channel, isActive]) => (
            <button
              key={channel}
              onClick={(e) =>
                toggleChannel(channel as keyof Channel, e.shiftKey)
              }
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {channel.charAt(0).toUpperCase() + channel.slice(1)}
            </button>
          ))}
        </div>
        <div className="text-xs text-gray-500 px-2 bg-white/80 backdrop-blur-sm rounded-full py-1">
          Shift+Click to solo a channel
        </div>
      </div>
    </div>
  );
}
