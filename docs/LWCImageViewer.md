# Image Viewer Application Documentation

## Overview

The Image Viewer application is a web-based tool that allows users to view and manipulate image color channels. It features a modern, responsive interface with support for multiple image formats, including TGA files. The application is built using React and TypeScript, with a focus on user experience and performance.

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
  - Real-time channel manipulation

### User Interface

- **Drag & Drop Support**

  - Full-window drag and drop functionality
  - Visual feedback during drag operations
  - File type validation
  - Multiple file upload support

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

## Best Practices & Recommendations

### Performance Optimization

1. **State Updates**

   - Use state comparison to prevent unnecessary updates
   - Implement proper cleanup for URL objects
   - Use key prop for component remounting

2. **File Handling**
   - Validate file types before processing
   - Clean up object URLs to prevent memory leaks
   - Handle multiple file uploads efficiently

### Error Prevention

1. **Event Handling**
   - Always prevent default behaviors
   - Stop event propagation where necessary
   - Implement proper type checking

## Error Handling & Troubleshooting

### Common Issues

1. **File Upload Failures**

   ```typescript
   const unsupportedCount = files.length - supportedFiles.length;
   if (unsupportedCount > 0) {
     alert(`${unsupportedCount} file(s) were not supported image formats.`);
   }
   ```

2. **Memory Management**
   ```typescript
   // Clean up URL objects
   if (closedTab?.imageUrl) {
     URL.revokeObjectURL(closedTab.imageUrl);
   }
   ```

### Edge Cases

- Handle missing files or corrupt data
- Manage tab state during deletion
- Handle window drag/drop events properly

## Additional Notes

### Dependencies

- React
- TypeScript
- Tailwind CSS
- react-zoom-pan-pinch (for image manipulation)

### Related Components

- ImageViewer
- Tabs
- Custom TGA parser

### Future Improvements

1. Additional image format support
2. Enhanced error messaging
3. Undo/Redo functionality
4. Image export options

### Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Proper event handling across platforms
- Consistent drag and drop behavior
