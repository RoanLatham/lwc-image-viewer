# LWC Image Viewer

<div align="center">

The LWC Image Viewer (Light-Weight Channel Image Viewer) is a React-based image viewer focused on color channel manipulation. Built with TypeScript and Next.js.

**[View Live Site](https://lwc-image-viewer.vercel.app/)**

![License](https://img.shields.io/github/license/RoanLatham/lwc-image-viewer)
![Next.js Version](https://img.shields.io/badge/next.js-14.0-blue)
![React Version](https://img.shields.io/badge/react-19.0-blue)

</div>

<details open>
<summary><h2>✨ Features</h2></summary>

### 🎨 Image Manipulation

- Toggle individual RGB and Alpha channels
- Real-time color channel manipulation
- Black & White mode conversion
- Pan, zoom, and fit controls

### 📑 Tab Management

- Multiple image support with tabbed interface
- Middle-click to close tabs
- Bulk close functionality
- Automatic tab switching

### 📥 Multiple Input Methods

- Drag and drop support across the entire window
- Traditional file picker
- Direct clipboard paste (Ctrl+V)
- Support for multiple files

### 🎯 Supported Formats

- Standard web formats (JPG, PNG, GIF, WebP)
- TGA file support with custom parser
- Clipboard images

### ⌨️ Keyboard Shortcuts

| Action      | Shortcut |
| ----------- | -------- |
| Fit to View | F        |
| Paste Image | Ctrl+V   |

</details>

<details open>
<summary><h2>🚀🌍 Getting Started</h2></summary>

The LWC Image Viewer is hosted on Vercel and can be accessed at [lwc-image-viewer.vercel.app](https://lwc-image-viewer.vercel.app/). Simply visit the site to start using the viewer - no installation required!

</details>

<details open>
<summary><h2>🚀🛠️ Getting Started (For Developers)</h2></summary>

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/lwc-image-viewer.git
cd lwc-image-viewer
```

2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
# or
pnpm build
pnpm start
# or
bun run build
bun start
```

</details>

<details open>
<summary><h2>💻 Technology Stack</h2></summary>

- **Framework**: [Next.js 14](https://nextjs.org/)
- **UI Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Image Manipulation**: [react-zoom-pan-pinch](https://www.npmjs.com/package/react-zoom-pan-pinch)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

</details>

<details open>
<summary><h2>🎯 Use Cases</h2></summary>

- **Digital Artists**: Analyze and manipulate image color channels
- **Developers**: Debug image assets and color compositions
- **Designers**: Inspect and verify image color information
- **Content Creators**: Quick image viewing and basic manipulation

</details>

<details open>
<summary><h2>🤝 Contributing</h2></summary>

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

</details>

<details open>
<summary><h2>📝 License</h2></summary>

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

</details>

---

<div align="center">

Made with ❤️ by Roan Latham

[Report Bug](https://github.com/yourusername/lwc-image-viewer/issues) · [Request Feature](https://github.com/yourusername/lwc-image-viewer/issues)

</div>
