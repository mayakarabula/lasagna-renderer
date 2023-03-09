let SCALE = 2;
let ROTATE = 0;

const LAYERS = 40;
const STACKING_DISTANCE = 2.5;
const W = 200;
const H = 200;

let characterX = 100;
let characterY = 400;
let sceneAngle = 45;
let characterAngle = 181;

const MIN_ANGLE = 20;
const MAX_ANGLE = 70;
const ANGLE_STEP = 5;

const map = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
];

const objects = {
  tree: {
    get: (angle) => {
      if (angle === objects.tree.prerender.angle) {
        return objects.tree.prerender.image;
      }
      const tree = document.getElementById("tree");
      const canvas = document.createElement("canvas");
      canvas.width = 24 * SCALE;
      canvas.height = 24 * SCALE + STACKING_DISTANCE * 24;
      const ctx = canvas.getContext("2d");

      // ctx.fillStyle = "red";
      // ctx.fillRect(0, 0, 500, 500);

      for (let layer = 0; layer < 24; layer++) {
        ctx.drawImage(
          getFrame(tree, layer, angle, 24, 24, 23),
          0,
          (24 - layer) * STACKING_DISTANCE,
          24 * SCALE,
          24 * SCALE
        );
      }

      objects.tree.prerender.angle = angle;
      objects.tree.prerender.image = canvas;

      return canvas;
    },
    prerender: {
      angle: -1,
      image: null,
    },
  },
};

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const realCtx = canvas.getContext("2d");
  const scene = document.getElementById("source");
  const character = document.getElementById("tree");

  const cleanCanvas = document.createElement("canvas");
  cleanCanvas.width = 500;
  cleanCanvas.height = 500;

  cleanCanvas.getContext("2d").fillRect(0, 0, 500, 500);

  const shadowCanvas = document.createElement("canvas");
  shadowCanvas.width = 500;
  shadowCanvas.height = 500;
  const ctx = shadowCanvas.getContext("2d");

  ctx.imageSmoothingEnabled = false;

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      sceneAngle -= ANGLE_STEP;
      pointAngle -= ANGLE_STEP;
    } else if (event.key === "ArrowRight") {
      sceneAngle += ANGLE_STEP;
      pointAngle += ANGLE_STEP;
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

  const drawShadowToCanvas = () => {
    realCtx.drawImage(shadowCanvas, 0, 0);
  };

  const intervalTime = 250;

  let pointAngle = 0;
  const cx = 500 / 2;
  const cy = 500 / 2;
  const radian = Math.PI / 180;

  const drawPoint = (x, y) => {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, 1, 1);
  };

  const rotatePoint = (x, y) => {
    const s = Math.sin(pointAngle * radian);
    const c = Math.cos(pointAngle * radian);

    x -= cx;
    y -= cy;

    const xnew = x * c - y * s;
    const ynew = x * s + y * c;

    x = xnew + cx;
    y = ynew + cy;

    return { x, y };
  };

  let start, previousTimeStamp;

  const step = (timestamp) => {
    if (start === undefined) {
      start = timestamp;
    }
    const elapsed = timestamp - start;

    if (previousTimeStamp === timestamp) {
      return;
    }

    ctx.fillStyle = "#799573";
    // ctx.fillRect(0, 0, 500, 500);
    // ctx.clearRect(0, 0, 500, 500);
    ctx.drawImage(cleanCanvas, 0, 0, 500, 500);

    const offsetX = -70;
    const offsetY = 100;

    // for (let i = 0; i <= LAYERS; i++) {
    //   ctx.drawImage(
    //     getFrame(scene, i, sceneAngle, W, H, LAYERS),
    //     offsetX,
    //     offsetY - i * STACKING_DISTANCE,
    //     W * SCALE,
    //     H * SCALE
    //   );
    // }

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        if (map[row][col] === 1) {
          const { x, y } = rotatePoint(
            row * 24 * SCALE,
            col * (24 * SCALE + STACKING_DISTANCE * 24)
          );

          ctx.drawImage(objects.tree.get(sceneAngle), x, y);
        }
      }
    }

    ctx.strokeStyle = "green";

    for (let row = 0; row < map.length; row++) {
      for (let col = 0; col < map[row].length; col++) {
        const { x, y } = rotatePoint(
          row * 24 * SCALE,
          col * (24 * SCALE + STACKING_DISTANCE * 24)
        );

        // ctx.rect(x, y, 24 * SCALE, 24 * SCALE + STACKING_DISTANCE * 24);
      }
    }
    ctx.stroke();

    drawShadowToCanvas();

    previousTimeStamp = timestamp;
    window.requestAnimationFrame(step);
  };

  window.requestAnimationFrame(step);

  // setInterval(() => {
  //   // pointAngle += 5;
  //   // rotatePoint();
  //   // drawPoint(x, y);
  // }, intervalTime);
};

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
