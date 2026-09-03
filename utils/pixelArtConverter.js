// Pixel Art Converter
export async function convertToPixelArt(imageElement, options) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      const { pixelSize, colorCount, contrast, dithering } = options;

      // Calculate pixelated dimensions
      const scaledWidth = Math.floor(imageElement.width / pixelSize);
      const scaledHeight = Math.floor(imageElement.height / pixelSize);

      // Step 1: Draw scaled down image
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
      if (!tempCtx) {
        reject(new Error('Could not get temp canvas context'));
        return;
      }

      tempCanvas.width = scaledWidth;
      tempCanvas.height = scaledHeight;
      tempCtx.imageSmoothingEnabled = false;
      tempCtx.drawImage(imageElement, 0, 0, scaledWidth, scaledHeight);

      let imageData = tempCtx.getImageData(0, 0, scaledWidth, scaledHeight);

      // Step 2: Apply contrast
      if (contrast !== 1.0) {
        imageData = applyContrast(imageData, contrast);
      }

      // Step 3: Quantize colors
      const palette = quantizeColors(imageData, colorCount);

      // Step 4: Apply dithering or direct color mapping
      if (dithering) {
        imageData = applyDithering(imageData, palette, scaledWidth, scaledHeight);
      } else {
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const color = [data[i], data[i + 1], data[i + 2]];
          const closest = findClosestColor(color, palette);
          data[i] = closest[0];
          data[i + 1] = closest[1];
          data[i + 2] = closest[2];
        }
      }

      tempCtx.putImageData(imageData, 0, 0);

      // Step 5: Scale back up with pixelated rendering
      canvas.width = scaledWidth * pixelSize;
      canvas.height = scaledHeight * pixelSize;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL('image/png'));
    } catch (error) {
      reject(error);
    }
  });
}

// K-means color quantization
function quantizeColors(imageData, colorCount) {
  const pixels = [];
  const data = imageData.data;

  // Sample pixels for k-means
  for (let i = 0; i < data.length; i += 4) {
    pixels.push([data[i], data[i + 1], data[i + 2]]);
  }

  // Initialize centroids randomly
  const centroids = [];
  for (let i = 0; i < colorCount; i++) {
    const randomPixel = pixels[Math.floor(Math.random() * pixels.length)];
    centroids.push([...randomPixel]);
  }

  // K-means iterations
  for (let iteration = 0; iteration < 10; iteration++) {
    const clusters = Array(colorCount)
      .fill(null)
      .map(() => []);

    // Assign pixels to nearest centroid
    for (const pixel of pixels) {
      let minDist = Infinity;
      let closestIdx = 0;

      for (let i = 0; i < centroids.length; i++) {
        const dist = colorDistance(pixel, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      }

      clusters[closestIdx].push(pixel);
    }

    // Update centroids
    for (let i = 0; i < centroids.length; i++) {
      if (clusters[i].length > 0) {
        centroids[i] = [
          Math.round(
            clusters[i].reduce((sum, p) => sum + p[0], 0) / clusters[i].length
          ),
          Math.round(
            clusters[i].reduce((sum, p) => sum + p[1], 0) / clusters[i].length
          ),
          Math.round(
            clusters[i].reduce((sum, p) => sum + p[2], 0) / clusters[i].length
          ),
        ];
      }
    }
  }

  return centroids;
}

function colorDistance(c1, c2) {
  return Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) +
      Math.pow(c1[1] - c2[1], 2) +
      Math.pow(c1[2] - c2[2], 2)
  );
}

function findClosestColor(color, palette) {
  let minDist = Infinity;
  let closest = palette[0];

  for (const paletteColor of palette) {
    const dist = colorDistance(color, paletteColor);
    if (dist < minDist) {
      minDist = dist;
      closest = paletteColor;
    }
  }

  return closest;
}

// Floyd-Steinberg dithering
function applyDithering(imageData, palette, width, height) {
  const data = imageData.data;
  const ditherData = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const oldColor = [ditherData[idx], ditherData[idx + 1], ditherData[idx + 2]];
      const newColor = findClosestColor(oldColor, palette);

      ditherData[idx] = newColor[0];
      ditherData[idx + 1] = newColor[1];
      ditherData[idx + 2] = newColor[2];

      const error = [
        oldColor[0] - newColor[0],
        oldColor[1] - newColor[1],
        oldColor[2] - newColor[2],
      ];

      // Distribute error to neighboring pixels
      const distribute = (ox, oy, factor) => {
        const nx = x + ox;
        const ny = y + oy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const nidx = (ny * width + nx) * 4;
          ditherData[nidx] = Math.max(0, Math.min(255, ditherData[nidx] + error[0] * factor));
          ditherData[nidx + 1] = Math.max(0, Math.min(255, ditherData[nidx + 1] + error[1] * factor));
          ditherData[nidx + 2] = Math.max(0, Math.min(255, ditherData[nidx + 2] + error[2] * factor));
        }
      };

      distribute(1, 0, 7 / 16);
      distribute(-1, 1, 3 / 16);
      distribute(0, 1, 5 / 16);
      distribute(1, 1, 1 / 16);
    }
  }

  return new ImageData(ditherData, width, height);
}

function applyContrast(imageData, contrast) {
  const data = imageData.data;
  const factor = (259 * (contrast * 100 + 255)) / (255 * (259 - contrast * 100));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));
    data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128));
    data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128));
  }

  return imageData;
}
