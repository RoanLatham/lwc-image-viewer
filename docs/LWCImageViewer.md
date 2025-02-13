# Image Viewer Application Documentation

## Overview

The LWC Image Viewer (Light-Weight Channel Image Viewer) is a web-based tool that allows users to view and manipulate image color channels. It features a modern, responsive interface with support for multiple image formats. The application is built using React and TypeScript, with a focus on user experience and performance.

## Features & Functionality

### Core Features

- **Multiple Image Support**
  - Handle multiple images through a tabbed interface
  - Support for standard image formats (JPG, PNG, GIF, WebP) and TGA files
  - Simultaneous viewing and manipulation of different images

### Image Manipulation

- **Color Channel Control**
  - Individual RGB channel toggling
  - Alpha channel support
  - Black & white mode conversion

### User Interface

- **Tab Management**
  - Dynamic tab creation and deletion
  - Automatic tab switching
  - Memory leak prevention through proper cleanup

## Key Components & Functions

### State Management

```typescript
const [tabs, setTabs] = useState<TabConfig[]>([]);
const [activeTabId, setActiveTabId] = useState<string | null>(null);
const [isDragging, setIsDragging] = useState(false);
```

### Core Functions

#### `handleStateChange`

```typescript
const handleStateChange = (state: ImageViewerState) => {
  if (!activeTabId) return;
  const currentTab = tabs.find((tab) => tab.id === activeTabId);
  if (JSON.stringify(currentTab?.state) === JSON.stringify(state)) {
    return;
  }
  setTabs((prevTabs) =>
    prevTabs.map((tab) => (tab.id === activeTabId ? { ...tab, state } : tab))
  );
};
```

Purpose: Manages state updates for the active image, preventing unnecessary rerenders.

#### `handleFileUpload`

```typescript
const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const files = event.target.files;
  if (!files) return;
  // Process files and create new tabs
};
```

Purpose: Handles file uploads through the traditional file input method.

#### Drag & Drop Handlers

```typescript
const handleDragEnter = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(true);
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(false);
  // Process dropped files
};
```

Purpose: Manage drag and drop functionality with visual feedback.

### Tab Management

- **Tab Actions**
  - Middle-click to close individual tabs
  - "Close All" button to clear all tabs at once
  - Automatic cleanup of image resources
  - Keyboard shortcuts for common actions

```typescript
// Middle-click tab closing
const handleTabClick = (e: React.MouseEvent<HTMLDivElement>, tabId: string) => {
  if (e.button === 1) {
    // Middle click
    handleTabClose(e, tabId);
    return;
  }
  // ... other click handling
};
```

### Image Controls

- **View Controls**
  - Fit to view button and hotkey (F key)
  - Pan and zoom with mouse

```typescript
// Fit view functionality
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "f" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      transformRef.current?.resetTransform();
    }
  };

  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
}, []);
```

### Image Input Methods

1. **File Upload Button**

   - Traditional file picker dialog
   - Multiple file selection support
   - Format validation

2. **Drag & Drop Support**

   - Full-window drag and drop functionality
   - Visual feedback during drag operations
   - File type validation
   - Multiple file upload support

3. **Clipboard Paste**
   - Direct paste from clipboard (Ctrl+V)
   - Supports images copied from:
     - Other applications
     - Screenshots
     - Web browsers
   - Automatic tab creation for pasted images

```typescript
// Clipboard paste handling
useEffect(() => {
  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (!file) continue;

        // Create new tab for pasted image
        const imageUrl = URL.createObjectURL(file);
        const newTab: TabConfig = {
          id: crypto.randomUUID(),
          title: "Pasted Image",
          imageUrl,
          imageFile: file,
          state: {
            channels: { red: true, green: true, blue: true, alpha: true },
            zoom: 1,
            position: { x: 0, y: 0 },
            rotation: 0,
          },
        };

        setTabs((prevTabs) => [...prevTabs, newTab]);
        setActiveTabId(newTab.id);
        break;
      }
    }
  };

  window.addEventListener("paste", handlePaste);
  return () => window.removeEventListener("paste", handlePaste);
}, []);
```

### Keyboard Shortcuts

| Action      | Shortcut |
| ----------- | -------- |
| Fit to View | F        |
| Paste Image | Ctrl+V   |

### Best Practices

1. **Memory Management**

   - Clean up object URLs when closing tabs
   - Proper event listener cleanup
   - State cleanup on component unmount

2. **User Experience**

   - Visual feedback for all actions
   - Consistent behavior across input methods
   - Intuitive keyboard shortcuts
   - Clear visual indicators for active states

3. **Error Prevention**
   - Validate input types
   - Handle edge cases (empty clipboard, unsupported formats)
   - Prevent accidental tab closure
   - Confirm destructive actions (close all)

## Usage Guide

### Adding Images

1. **File Upload Button**

   ```typescript
   <input
     id="file-upload"
     type="file"
     accept="image/*,.tga,.TGA"
     multiple
     className="hidden"
     onChange={handleFileUpload}
   />
   ```

2. **Drag & Drop**
   - Drag files anywhere on the window
   - Visual feedback indicates drop zone
   - Multiple files supported

### Image Manipulation

```typescript
<ImageViewer
  key={activeTab.id}
  imageUrl={activeTab.imageUrl}
  imageFile={activeTab.imageFile}
  initialState={activeTab.state}
  onStateChange={handleStateChange}
/>
```

## Customization & Configuration

### Supported File Types

```typescript
accept = "image/*,.tga,.TGA";
```

- Standard web image formats (JPG, PNG, GIF, WebP)
- TGA files (custom implementation)

### Visual Customization

- Tailwind CSS classes for styling
- Configurable UI elements through className props
- Responsive design considerations

## Additional Notes

### Dependencies

- React
- TypeScript
- Tailwind CSS
- react-zoom-pan-pinch (for image manipulation)

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Proper event handling across platforms
- Consistent drag and drop behavior
