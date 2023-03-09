let points = [];
let edges = [];

const generatePoints = () => {
  const w = 40;

  for (let y = 1; y < 10; y++) {
    for (let x = 1; x < 10; x++) {
      points.push({
        x: x * w - (w * 10) / 2,
        y: y * w - (w * 10) / 2,
        z: 0,
      });
    }
  }

  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      edges.push([x + y * 9, x + 1 + y * 9]);
      edges.push([x + y * 9, x + (y + 1) * 9]);
    }
  }
};

generatePoints();

const projectPoint = (
  p,
  focalLength,
  width,
  height,
  zTheta,
  xTheta,
  yTheta
) => {
  let x = p.x * Math.cos(zTheta) - p.y * Math.sin(zTheta);
  let y = p.x * Math.sin(zTheta) + p.y * Math.cos(zTheta);
  let z = p.z;

  x = x * Math.cos(yTheta) + z * Math.sin(yTheta);
  z = z * Math.cos(yTheta) - z * Math.sin(yTheta);

  y = y * Math.cos(xTheta) - z * Math.sin(xTheta);
  z = z * Math.sin(xTheta) + z * Math.cos(xTheta);

  let scaleProjected = focalLength / (focalLength + z);

  return {
    x: x * scaleProjected + width / 2,
    y: y * scaleProjected + height / 2,
  };
};

const project = (focalLength, points3d, width, height) => {
  const zTheta = +document.getElementById("z").value / 100;
  const xTheta = +document.getElementById("x").value / 100;
  const yTheta = +document.getElementById("y").value / 100;

  return points3d.map((p) => {
    return projectPoint(p, focalLength, width, height, zTheta, xTheta, yTheta);
  });
};

const draw = () => {
  const canvas = document.getElementById("canvas");
  const context = canvas.getContext("2d");
  const zTheta = +document.getElementById("z").value / 100;
  const xTheta = +document.getElementById("x").value / 100;
  const yTheta = +document.getElementById("y").value / 100;

  const focalLength = 20;

  let projectedPyramid = project(focalLength, points, 20.0, 20.0);

  context.fillStyle = "black";
  context.strokeStyle = "white";
  context.lineWidth = 1;
  context.lineCap = "round";

  context.fillRect(0, 0, 500, 500);

  //   for (let edge of edges) {
  //     context.beginPath();
  //     context.moveTo(
  //       projectedPyramid[edge[0]].x + 200,
  //       projectedPyramid[edge[0]].y + 200
  //     );

  //     context.lineTo(
  //       projectedPyramid[edge[1]].x + 200,
  //       projectedPyramid[edge[1]].y + 200
  //     );

  //     context.stroke();
  //   }

  for (let i = 0; i < 50; i++) {
    context.drawImage(
      objects.ground.get((zTheta * 180) / Math.PI),
      Math.floor(projectedPyramid[i].x + 200),
      Math.floor(projectedPyramid[i].y + 200) - STACKING_DISTANCE * 40
    );

    if (i == 30) {
      context.drawImage(
        objects.tree.get((zTheta * 180) / Math.PI),
        Math.floor(projectedPyramid[30].x + 200),
        Math.floor(projectedPyramid[30].y + 200) - STACKING_DISTANCE * 40
      );
    }
  }
  for (let i = 50; i <= 80; i++) {
    context.drawImage(
      objects.water.get((zTheta * 180) / Math.PI),
      Math.floor(projectedPyramid[i].x + 200),
      Math.floor(projectedPyramid[i].y + 200) - STACKING_DISTANCE * 40
    );
  }
};

const SCALE = 1;
const STACKING_DISTANCE = 2;
const radian = Math.PI / 180;
const cx = 200;
const cy = 200;

const objects = {
  ground: {
    get: (angle) => {
      if (angle === objects.ground.prerender.angle) {
        return objects.ground.prerender.image;
      }
      const ground = document.getElementById("source");
      const canvas = document.createElement("canvas");
      const coefficient = Math.sqrt(2);

      canvas.width = 40 * SCALE * coefficient;
      canvas.height = (40 * SCALE + STACKING_DISTANCE * 40) * coefficient;
      const ctx = canvas.getContext("2d");

      for (let layer = 0; layer < 40; layer++) {
        ctx.drawImage(
          getFrame(ground, layer, angle, 40, 40, 39),
          0,
          (40 - layer) * STACKING_DISTANCE,
          40 * SCALE * coefficient,
          40 * SCALE * coefficient
        );
      }

      objects.ground.prerender.angle = angle;
      objects.ground.prerender.image = canvas;

      return canvas;
    },
    prerender: {
      angle: -1,
      image: null,
    },
  },
  water: {
    get: (angle) => {
      if (angle === objects.water.prerender.angle) {
        return objects.water.prerender.image;
      }
      const water = document.getElementById("water");
      const canvas = document.createElement("canvas");
      const coefficient = Math.sqrt(2);

      canvas.width = 40 * SCALE * coefficient;
      canvas.height = (40 * SCALE + STACKING_DISTANCE * 40) * coefficient;
      const ctx = canvas.getContext("2d");

      for (let layer = 0; layer < 40; layer++) {
        ctx.drawImage(
          getFrame(water, layer, angle, 40, 40, 39),
          0,
          (40 - layer) * STACKING_DISTANCE,
          40 * SCALE * coefficient,
          40 * SCALE * coefficient
        );
      }

      objects.water.prerender.angle = angle;
      objects.water.prerender.image = canvas;

      return canvas;
    },
    prerender: {
      angle: -1,
      image: null,
    },
  },
  tree: {
    get: (angle) => {
      if (angle === objects.tree.prerender.angle) {
        return objects.tree.prerender.image;
      }
      const tree = document.getElementById("tree");
      const canvas = document.createElement("canvas");
      const coefficient = Math.sqrt(2);

      canvas.width = 40 * SCALE * coefficient;
      canvas.height = (40 * SCALE + STACKING_DISTANCE * 40) * coefficient;
      const ctx = canvas.getContext("2d");

      for (let layer = 0; layer < 40; layer++) {
        ctx.drawImage(
          getFrame(tree, layer, angle, 40, 40, 39),
          0,
          (40 - layer) * STACKING_DISTANCE,
          40 * SCALE * coefficient,
          40 * SCALE * coefficient
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

const rotatePoint = (x, y, angle) => {
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  x -= cx;
  y -= cy;

  const xnew = x * c - y * s;
  const ynew = x * s + y * c;

  x = xnew + cx;
  y = ynew + cy;

  return { x, y };
};

window.onload = () => {
  setInterval(() => draw(), 150);
};
