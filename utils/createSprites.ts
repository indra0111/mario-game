export const createPlaceholderSprite = (
  width: number,
  height: number,
  color: string,
  shape: 'rectangle' | 'circle' = 'rectangle'
): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.fillStyle = color;
  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, width, height);
  }

  return canvas.toDataURL();
};

export const createMarioSprite = (width: number, height: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Draw Mario's body (red overalls)
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(width * 0.2, height * 0.3, width * 0.6, height * 0.7);

  // Draw Mario's shirt (blue)
  ctx.fillStyle = '#4444FF';
  ctx.fillRect(width * 0.2, height * 0.3, width * 0.6, height * 0.3);

  // Draw Mario's head
  ctx.fillStyle = '#FFA07A';
  ctx.beginPath();
  ctx.arc(width * 0.5, height * 0.25, width * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Draw Mario's hat (red)
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(width * 0.2, height * 0.15, width * 0.6, height * 0.1);

  // Draw Mario's face
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(width * 0.45, height * 0.23, width * 0.03, 0, Math.PI * 2); // eye
  ctx.fill();
  ctx.beginPath();
  ctx.arc(width * 0.4, height * 0.28, width * 0.08, 0, Math.PI); // mustache

  return canvas.toDataURL();
};

export const createRunningMarioSprite = (width: number, height: number): string => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Similar to createMarioSprite but with bent legs
  // Draw Mario's body (red overalls)
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(width * 0.2, height * 0.3, width * 0.6, height * 0.5);

  // Draw legs in running position
  ctx.fillRect(width * 0.2, height * 0.7, width * 0.2, height * 0.3);
  ctx.fillRect(width * 0.6, height * 0.6, width * 0.2, height * 0.2);

  // Draw Mario's shirt (blue)
  ctx.fillStyle = '#4444FF';
  ctx.fillRect(width * 0.2, height * 0.3, width * 0.6, height * 0.3);

  // Draw Mario's head
  ctx.fillStyle = '#FFA07A';
  ctx.beginPath();
  ctx.arc(width * 0.5, height * 0.25, width * 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Draw Mario's hat (red)
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(width * 0.2, height * 0.15, width * 0.6, height * 0.1);

  return canvas.toDataURL();
}; 