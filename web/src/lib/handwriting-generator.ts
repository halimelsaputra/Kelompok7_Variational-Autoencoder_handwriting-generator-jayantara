// Client-side parametric handwriting generator simulating VAE latent space
// Generates a 28x28 grayscale MNIST-like PNG image in base64

export function generateHandwritingImage(
  digit: number,
  z1: number,
  z2: number
): string {
  if (typeof document === "undefined") return "";

  const canvas = document.createElement("canvas");
  canvas.width = 28;
  canvas.height = 28;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Background black (0,0,0)
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 28, 28);

  // 2. Setup stroke style
  ctx.save();

  // Center coordinate is (14, 14)
  ctx.translate(14, 14);

  // z1 affects horizontal slant/skew and slight translation
  const slant = z1 * 0.08;
  const shiftX = z1 * 0.4;
  const shiftY = z2 * 0.3;
  ctx.transform(1, 0, slant, 1, shiftX, shiftY);

  // z2 affects stroke thickness and vertical scaling/fullness
  const baseThickness = 2.2 + z2 * 0.35;
  const clampedThickness = Math.max(1.4, Math.min(3.6, baseThickness));
  ctx.lineWidth = clampedThickness;
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  ctx.beginPath();

  // Draw strokes for digit 0 - 9
  switch (digit) {
    case 0: {
      const rx = 5.2 + z2 * 0.4;
      const ry = 8.5 - Math.abs(z1) * 0.3;
      ctx.ellipse(0, 0, Math.max(3.5, rx), Math.max(6, ry), slant * 0.4, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 1: {
      ctx.moveTo(-1.5 - z1 * 0.3, -8);
      ctx.lineTo(0.5, -9);
      ctx.lineTo(0.5 + z1 * 0.2, 9);
      ctx.moveTo(-3, 9);
      ctx.lineTo(4, 9);
      ctx.stroke();
      break;
    }
    case 2: {
      ctx.moveTo(-6, -5.5);
      ctx.bezierCurveTo(-6, -10, 6, -10, 6, -5);
      ctx.bezierCurveTo(6, 0, -5, 4, -5.5, 8.5);
      ctx.lineTo(6.5, 8.5);
      ctx.stroke();
      break;
    }
    case 3: {
      ctx.moveTo(-5.5, -8.5);
      ctx.lineTo(4.5, -8.5);
      ctx.lineTo(0.5, -2);
      ctx.bezierCurveTo(5.5, -2, 6.5, 6, -4.5, 8);
      ctx.stroke();
      break;
    }
    case 4: {
      ctx.moveTo(2.5, -9);
      ctx.lineTo(-6, 2.5);
      ctx.lineTo(6.5, 2.5);
      ctx.moveTo(2.5, -2);
      ctx.lineTo(2.5, 9);
      ctx.stroke();
      break;
    }
    case 5: {
      ctx.moveTo(5, -8.5);
      ctx.lineTo(-4.5, -8.5);
      ctx.lineTo(-4.5, -1.5);
      ctx.bezierCurveTo(-3, -3, 6, -1, 5, 5.5);
      ctx.bezierCurveTo(4, 8.5, -1, 9, -5.5, 7.5);
      ctx.stroke();
      break;
    }
    case 6: {
      ctx.moveTo(3.5, -8.5);
      ctx.bezierCurveTo(-6, -7, -6, 7, -0.5, 8);
      ctx.bezierCurveTo(5.5, 8, 5.5, 0.5, -2, 0.5);
      ctx.bezierCurveTo(-5.5, 0.5, -5.5, 5, -5.5, 5);
      ctx.stroke();
      break;
    }
    case 7: {
      ctx.moveTo(-6, -8.5);
      ctx.lineTo(5.5, -8.5);
      ctx.bezierCurveTo(3, -2, -1, 4, -3.5, 9);
      if (Math.abs(z2) > 0.8) {
        ctx.moveTo(-3, 0);
        ctx.lineTo(2.5, 0);
      }
      ctx.stroke();
      break;
    }
    case 8: {
      const topR = 4.2 + z2 * 0.2;
      const botR = 5.2 + z2 * 0.3;
      ctx.beginPath();
      ctx.ellipse(0, -4.5, Math.max(3, topR), 4.2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(0, 4.5, Math.max(3.5, botR), 5, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case 9: {
      ctx.moveTo(0.5, 0.5);
      ctx.bezierCurveTo(-5.5, 0.5, -5.5, -8, 0, -8);
      ctx.bezierCurveTo(5.5, -8, 5.5, 0, 0, 0);
      ctx.moveTo(4.5, -4);
      ctx.bezierCurveTo(4.5, 4, 3, 8.5, -3.5, 9);
      ctx.stroke();
      break;
    }
    default:
      break;
  }

  ctx.restore();

  // 3. Apply subtle VAE reconstruction blur/softening to simulate neural decoder
  const imgData = ctx.getImageData(0, 0, 28, 28);
  const d = imgData.data;
  const copy = new Uint8ClampedArray(d);

  for (let y = 1; y < 27; y++) {
    for (let x = 1; x < 27; x++) {
      const idx = (y * 28 + x) * 4;
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nIdx = ((y + dy) * 28 + (x + dx)) * 4;
          sum += copy[nIdx];
        }
      }
      const avg = sum / 9;
      const original = copy[idx];
      const finalVal = Math.min(255, Math.round(original * 0.65 + avg * 0.35));
      d[idx] = finalVal;
      d[idx + 1] = finalVal;
      d[idx + 2] = finalVal;
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(imgData, 0, 0);

  // 4. Convert to data URL and return base64
  const dataUrl = canvas.toDataURL("image/png");
  return dataUrl.split(",")[1];
}
