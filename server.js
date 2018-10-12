const randomstring = require("randomstring");
const WebSocket = require("ws");

const config = { port: 8082 };
const wss = new WebSocket.Server(config);

function jsonPatch() {
  const titleA = randomstring.generate(8);
  const titleB = randomstring.generate(8);

  return [
    {
      op: "replace",
      path: "/0/label",
      value: `Jx ${titleA}`
    },
    {
      op: "add",
      path: "/1",
      value: {
        kind: "CD",
        label: `Team ${titleB}`,
        name: `Team ${titleB}`,
        namespace: titleB.toLowerCase().substr(0, 2),
        status: "Complete"
      }
    }
  ];
}

wss.on("connection", ws => {
  ws.isAlive = true;
});

setInterval(() => {
  wss.clients.forEach(ws => {
    const patch = JSON.stringify(jsonPatch(), null, 2);
    console.log("JSON Patch:\n", patch, "\n\n");
    ws.send(patch);
  });
}, 2000);

console.log(`WS server startd on port: ${config.port}`);
