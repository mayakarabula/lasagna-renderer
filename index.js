let SCALE = 3;
let ROTATE = 0;

const W = 200;
const H = 200;
const LAYERS = 199;
const STACKING_DISTANCE = 4;

let angle = 46;
const MIN_ANGLE = 20;
const MAX_ANGLE = 70;
const ANGLE_STEP = 10;

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const image = document.getElementById("source");

  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#5d8f63";

  document.addEventListener("keydown", function (event) {
    if (event.keyCode == 37 && angle > MIN_ANGLE) {
      // left
      angle -= ANGLE_STEP;
    } else if (event.keyCode == 39 && angle < MAX_ANGLE) {
      //right
      angle += ANGLE_STEP;
    }
  });

  const intervalTime = 100;

  setInterval(() => {
    ctx.fillRect(0, 0, 500, 500);

    const offsetX = -100;
    const offsetY = 100;

    for (let i = 0; i <= LAYERS; i++) {
      ctx.drawImage(
        getFrame(image, i, angle),
        offsetX,
        offsetY - i * STACKING_DISTANCE,
        W * SCALE,
        H * SCALE
      );
    }
  }, intervalTime);
};

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

const getFrame = (source, frameIndex, angle) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const coefficient = Math.sqrt(2);
  canvas.width = W * coefficient;
  canvas.height = H * coefficient;

  const centerX = W / 2 + (canvas.width - W) / 2;
  const centerY = H / 2 + (canvas.height - H) / 2;
  ctx.translate(centerX, centerY);

  ctx.rotate((angle * Math.PI) / 180);

  const sourceX = -1; // this is offset to avoid artefacts from rotation, couldn't find a better way
  const sourceY = -1 + H * (LAYERS - frameIndex);
  const sourceWidth = W;
  const sourceHeight = H;
  const targetX = -W / 2; // start of drawing is moved to center so we need to offset by half
  const targetY = -H / 2;
  const targetWidth = W;
  const targetHeight = H;

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
