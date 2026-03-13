const express = require("express");

const app = express();
app.use(express.json());

const queue = [];

app.post("/trigger", (req, res) => {
  const leadId = req.body?.leadId;

  if (!leadId) {
    return res.status(400).json({ ok: false, error: "leadId is required" });
  }

  queue.push({
    action: "open_lead",
    leadId,
    createdAt: new Date().toISOString(),
  });

  res.json({
    ok: true,
    queued: queue.length,
  });
});

app.get("/next-command", (req, res) => {
  const next = queue.shift();
  res.json(next || {});
});

app.listen(3001, "127.0.0.1", () => {
  console.log("Trigger server listening on http://127.0.0.1:3001");
});
