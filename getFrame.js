const getFrame = (source, frameIndex, angle, w, h, layers) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const coefficient = Math.sqrt(2);
  canvas.width = w * coefficient;
  canvas.height = h * coefficient;

  const centerX = w / 2 + (canvas.width - w) / 2;
  const centerY = h / 2 + (canvas.height - h) / 2;
  ctx.translate(centerX, centerY);

  ctx.rotate((angle * Math.PI) / 180);

  const sourceX = -1; // this is offset to avoid artefacts from rotation, couldn't find a better way
  const sourceY = -1 + h * (layers - frameIndex);
  const sourceWidth = w;
  const sourceHeight = h;
  const targetX = -w / 2; // start of drawing is moved to center so we need to offset by half
  const targetY = -h / 2;
  const targetWidth = w;
  const targetHeight = h;

  ctx.drawImage(
    source,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    targetX,
    targetY,
    targetWidth,
    targetHeight
  );

  return canvas;
};
