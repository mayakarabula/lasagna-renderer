let SCALE = 3;
let ROTATE = 0;

const W = 200;
const H = 200;
const LAYERS = 199;
const STACKING_DISTANCE = 4;

let characterX = 100;
let characterY = 400;
let sceneAngle = 46;
let characterAngle = 181;
const MIN_ANGLE = 20;
const MAX_ANGLE = 70;
const ANGLE_STEP = 10;

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const scene = document.getElementById("source");
  const character = document.getElementById("girl");

  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#799573";

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" && sceneAngle > MIN_ANGLE) {
      sceneAngle -= ANGLE_STEP;
      characterAngle -= ANGLE_STEP;
    } else if (event.key === "ArrowRight" && sceneAngle < MAX_ANGLE) {
      sceneAngle += ANGLE_STEP;
      characterAngle += ANGLE_STEP;
    } else if (event.key === "w") {
      characterY -= ANGLE_STEP;
    } else if (event.key === "s") {
      characterY += ANGLE_STEP;
    } else if (event.key === "a") {
      characterAngle -= ANGLE_STEP;
    } else if (event.key === "d") {
      characterAngle += ANGLE_STEP;
    }
  });

  const intervalTime = 100;

  setInterval(() => {
    ctx.fillRect(0, 0, 500, 500);

    const offsetX = -70;
    const offsetY = 100;

    for (let i = 0; i <= LAYERS; i++) {
      ctx.drawImage(
        getFrame(scene, i, sceneAngle, W, H, LAYERS),
        offsetX,
        offsetY - i * STACKING_DISTANCE,
        W * SCALE,
        H * SCALE
      );
    }

    for (let i = 0; i <= 40; i++) {
      ctx.drawImage(
        getFrame(character, i, characterAngle, 40, 40, 39),
        characterX,
        characterY - i * STACKING_DISTANCE,
        40 * SCALE,
        40 * SCALE
      );
    }
  }, intervalTime);
};

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

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
