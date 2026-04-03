const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

const socket = new WebSocket("wss://YOUR_SERVER_URL");

let playerId, myColor;
let state = { players: [] };
let input = { dx: 0, dy: 0, smash: false };

// 🎮 Touch Joystick
const stick = document.getElementById("stick");
document.getElementById("joystick").ontouchmove = e => {
  const t = e.touches[0];
  input.dx = (t.clientX - 80) / 40;
  input.dy = (t.clientY - (innerHeight - 80)) / 40;
};

document.getElementById("action").ontouchstart = () =>
  input.smash = true;

socket.onmessage = e => {
  const data = JSON.parse(e.data);
  if (data.type === "init") {
    playerId = data.id;
    myColor = data.color;
  }
  if (data.type === "state") state = data;
};

function loop() {
  ctx.clearRect(0,0,canvas.width,canvas.height);

  state.players?.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 14, 0, Math.PI*2);
    ctx.fill();

    // score text
    ctx.fillStyle = "#fff";
    ctx.fillText(p.score, p.x - 5, p.y - 18);
  });

  socket.send(JSON.stringify({ type:"input", ...input }));
  input.smash = false;

  requestAnimationFrame(loop);
}
loop();
