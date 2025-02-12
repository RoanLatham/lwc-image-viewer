interface TGAHeader {
  idLength: number;
  colorMapType: number;
  imageType: number;
  colorMapOrigin: number;
  colorMapLength: number;
  colorMapDepth: number;
  xOrigin: number;
  yOrigin: number;
  width: number;
  height: number;
  pixelDepth: number;
  imageDescriptor: number;
}

export async function loadTGA(file: File): Promise<HTMLCanvasElement> {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  let offset = 0;

  // Parse header
  const header: TGAHeader = {
    idLength: view.getUint8(offset),
    colorMapType: view.getUint8(offset + 1),
    imageType: view.getUint8(offset + 2),
    colorMapOrigin: view.getUint16(offset + 3, true),
    colorMapLength: view.getUint16(offset + 5, true),
    colorMapDepth: view.getUint8(offset + 7),
    xOrigin: view.getUint16(offset + 8, true),
    yOrigin: view.getUint16(offset + 10, true),
    width: view.getUint16(offset + 12, true),
    height: view.getUint16(offset + 14, true),
    pixelDepth: view.getUint8(offset + 16),
    imageDescriptor: view.getUint8(offset + 17),
  };

  offset = 18 + header.idLength + header.colorMapLength;

  // Create canvas
  const canvas = document.createElement("canvas");
  canvas.width = header.width;
  canvas.height = header.height;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(header.width, header.height);

  // Parse pixel data
  const pixels = new Uint8Array(buffer, offset);
  let pixelOffset = 0;
  let dataOffset = 0;

  // Handle different image types
  switch (header.imageType) {
    case 2: // Uncompressed RGB
      for (let i = 0; i < header.width * header.height; i++) {
        const b = pixels[pixelOffset++];
        const g = pixels[pixelOffset++];
        const r = pixels[pixelOffset++];
        const a = header.pixelDepth === 32 ? pixels[pixelOffset++] : 255;

        imageData.data[dataOffset++] = r;
        imageData.data[dataOffset++] = g;
        imageData.data[dataOffset++] = b;
        imageData.data[dataOffset++] = a;
      }
      break;

    case 10: // RLE compressed RGB
      while (dataOffset < imageData.data.length) {
        const packet = pixels[pixelOffset++];
        const runLength = (packet & 0x7f) + 1;
        const isRLE = packet & 0x80;

        for (let i = 0; i < runLength; i++) {
          if (isRLE) {
            // RLE packet
            const b = pixels[pixelOffset];
            const g = pixels[pixelOffset + 1];
            const r = pixels[pixelOffset + 2];
            const a = header.pixelDepth === 32 ? pixels[pixelOffset + 3] : 255;

            imageData.data[dataOffset++] = r;
            imageData.data[dataOffset++] = g;
            imageData.data[dataOffset++] = b;
            imageData.data[dataOffset++] = a;
          } else {
            // Raw packet
            const b = pixels[pixelOffset++];
            const g = pixels[pixelOffset++];
            const r = pixels[pixelOffset++];
            const a = header.pixelDepth === 32 ? pixels[pixelOffset++] : 255;

            imageData.data[dataOffset++] = r;
            imageData.data[dataOffset++] = g;
            imageData.data[dataOffset++] = b;
            imageData.data[dataOffset++] = a;
          }
        }

        if (isRLE) {
          pixelOffset += header.pixelDepth === 32 ? 4 : 3;
        }
      }
      break;

    default:
      throw new Error(`Unsupported TGA image type: ${header.imageType}`);
  }

  // Put image data on canvas
  ctx.putImageData(imageData, 0, 0);

  return canvas;
}
