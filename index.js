let SCALE = 3;
let ROTATE = 0;

const W = 200;
const H = 200;
const LAYERS = 199;
let angle = 46;

window.onload = () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const image = document.getElementById("source");

  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#5d8f63";

  document.addEventListener("keydown", function (event) {
    if (event.keyCode == 37 && angle > 20) {
      angle -= 10;
    } else if (event.keyCode == 39 && angle < 70) {
      angle += 10;
    }
  });

  setInterval(() => {
    ctx.fillRect(0, 0, 500, 500);

    for (let i = 0; i <= LAYERS; i++) {
      ctx.drawImage(
        getFrame(image, i, angle),
        -100,
        100 - i * 4,
        W * SCALE,
        H * SCALE
      );
    }
  }, 100);
};

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

const getFrame = (source, frameIndex, angle) => {
  const canvas = document.createElement("canvas");

  const coefficient = Math.sqrt(2);

  canvas.width = W * coefficient;
  canvas.height = H * coefficient;
  const ctx = canvas.getContext("2d");

  if (angle) {
    ctx.translate(
      W / 2 + (canvas.width - W) / 2,
      H / 2 + (canvas.height - H) / 2
    );
    ctx.rotate((angle * Math.PI) / 180);
    ctx.drawImage(
      source,
      -1,
      -1 + H * (LAYERS - frameIndex),
      W,
      H,
      -W / 2,
      -H / 2,
      W,
      H
    );
  } else {
    ctx.drawImage(source, 0, H * (LAYERS - frameIndex), W, H, 0, 0, W, H);
  }

  return canvas;
};
