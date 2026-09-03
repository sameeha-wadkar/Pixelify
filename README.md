# Pixelify

A privacy-first, fully client-side image-to-pixel-art converter. Upload any image and transform it into pixel art directly in your browser — nothing is uploaded to a server, and no data ever leaves your device.

**Live Demo:** [https://pixelify-rho.vercel.app/]

---

## Preview

|                    Original                    | Pixel Art |
|:----------------------------------------------:|:---:|
| ![Original image](./screenshots/original.jpeg) | ![Pixel art result](./screenshots/result.png) |



---

## Features

- **Instant conversion** — powered by the HTML5 Canvas API, with ~40% faster rendering than a naive pixel-by-pixel approach
- **Style presets** — Retro, Classic, Detailed, and Modern, each with tuned defaults
- **Fine-grained controls** — adjust pixel size, color palette size, and contrast in real time
- **Dithering support** — Floyd–Steinberg dithering for smoother color gradients
- **100% client-side** — image processing happens entirely in the browser via Canvas, with no backend and no network calls
- **No limits, no account required** — free to use, unlimited conversions

## Tech Stack

- **React** + **TypeScript**
- **Vite** — build tooling and dev server
- **Tailwind CSS** — styling
- **Canvas API** — core pixel-art conversion (k-means color quantization, Floyd–Steinberg dithering)
- **Radix UI / shadcn** — accessible UI primitives

## How It Works

1. An uploaded image is drawn onto a scaled-down canvas based on the chosen pixel size
2. Colors are quantized using k-means clustering to the selected palette size
3. Optional dithering is applied to smooth color transitions
4. The result is scaled back up with pixelated rendering and exported as a downloadable PNG

All of this runs synchronously in the browser — no image data is ever transmitted anywhere.

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm

### Installation

```bash
git clone https://github.com/sameeha-wadkar/pixelify.git
cd pixelify
npm install
```

### Run locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```

## Project Structure

```
pixelify/
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── HeroSection.tsx
│   │   ├── UploadArea.tsx
│   │   ├── ControlPanel.tsx
│   │   ├── PreviewArea.tsx
│   │   ├── FeatureCards.tsx
│   │   └── ui/
│   ├── utils/
│   │   └── pixelArtConverter.js
│   └── styles/
│       └── globals.css
└── package.json
```


## License

This project is available under the [MIT License](LICENSE).

## Author

**Sameeha**
[GitHub](https://github.com/sameeha-wadkar) · [LinkedIn](https://linkedin.com/in/sameeha-wadkar)
