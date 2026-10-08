import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");
const ROUNDS = ["qualifier", "semi-final", "final"];

const app = express();
app.use(cors());          // lets the React app (different port) call this API
app.use(express.json());  // lets us read JSON request bodies

// ---------- Simple "database" ----------
let db = { teams: [], runs: [], nextTeamId: 1, nextRunId: 1 };

if (fs.existsSync(DATA_FILE)) {
  db = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function saveDb() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

// ---------- Teams ----------
app.post("/api/teams", (req, res) => {
  const { teamName, robotName, members } = req.body;

  if (!teamName || !robotName) {
    return res.status(400).json({ error: "teamName and robotName are required" });
  }
  if (!Array.isArray(members) || members.length === 0) {
    return res.status(400).json({ error: "members must be a non-empty array" });
  }

  const team = {
    id: db.nextTeamId++,
    teamName: teamName.trim(),
    robotName: robotName.trim(),
    members, // e.g. [{ name: "Asha", email: "asha@x.com" }]
  };
  db.teams.push(team);
  saveDb();
  res.status(201).json(team);
});

app.get("/api/teams", (req, res) => {
  res.json(db.teams);
});

// ---------- Runs ----------
app.post("/api/runs", (req, res) => {
  const { teamId, round, trackTime, penaltyTime = 0, dnf = false } = req.body;

  const team = db.teams.find((t) => t.id === Number(teamId));
  if (!team) return res.status(404).json({ error: "Team not found" });

  if (!ROUNDS.includes(round)) {
    return res.status(400).json({ error: `round must be one of: ${ROUNDS.join(", ")}` });
  }

  const track = Number(trackTime);
  const penalty = Number(penaltyTime);

  // A DNF run has no meaningful time, so only validate times for finished runs
  if (!dnf) {
    if (!Number.isFinite(track) || track <= 0) {
      return res.status(400).json({ error: "trackTime must be a positive number" });
    }
  }
  if (!Number.isFinite(penalty) || penalty < 0) {
    return res.status(400).json({ error: "penaltyTime must be 0 or more" });
  }

  const run = {
    id: db.nextRunId++,
    teamId: team.id,
    round,
    trackTime: dnf ? null : track,
    penaltyTime: penalty,
    totalTime: dnf ? null : track + penalty,
    dnf: Boolean(dnf),
    submittedAt: new Date().toISOString(),
  };
  db.runs.push(run);
  saveDb();
  res.status(201).json(run);
});
// ---------- List and delete runs ----------
app.get("/api/runs", (req, res) => {
  // Newest first, with the team name attached for display
  const runs = [...db.runs].reverse().map((run) => {
    const team = db.teams.find((t) => t.id === run.teamId);
    return { ...run, teamName: team ? team.teamName : "Unknown team" };
  });
  res.json(runs);
});

app.delete("/api/runs/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = db.runs.findIndex((r) => r.id === id);
  if (index === -1) return res.status(404).json({ error: "Run not found" });

  db.runs.splice(index, 1);
  saveDb();
  res.json({ message: "Run deleted" });
});
// ---------- Leaderboard ----------
app.get("/api/leaderboard", (req, res) => {
  const round = req.query.round;
  if (!ROUNDS.includes(round)) {
    return res.status(400).json({ error: `round must be one of: ${ROUNDS.join(", ")}` });
  }

  const roundRuns = db.runs.filter((r) => r.round === round);

  // Build one row per team that has at least one run this round
  const rows = [];
  for (const team of db.teams) {
    const teamRuns = roundRuns.filter((r) => r.teamId === team.id);
    if (teamRuns.length === 0) continue;

    const validRuns = teamRuns.filter((r) => !r.dnf);
    const bestRun = validRuns.length
      ? validRuns.reduce((best, r) => (r.totalTime < best.totalTime ? r : best))
      : null;

    rows.push({
      teamId: team.id,
      teamName: team.teamName,
      robotName: team.robotName,
      bestTime: bestRun ? bestRun.totalTime : null,
      dnf: bestRun === null, // true only if EVERY run was a DNF
      runCount: teamRuns.length,
    });
  }

  // Valid times first (ascending), DNF teams at the bottom
  rows.sort((a, b) => {
    if (a.dnf && b.dnf) return 0;
    if (a.dnf) return 1;
    if (b.dnf) return -1;
    return a.bestTime - b.bestTime;
  });

  // Assign ranks (DNF teams get no rank)
  let rank = 1;
  rows.forEach((row) => {
    row.rank = row.dnf ? null : rank++;
  });

  // Most recently submitted run in this round
  const latestRun = roundRuns.length
    ? roundRuns.reduce((a, b) => (a.id > b.id ? a : b))
    : null;

  res.json({ round, leaderboard: rows, latestRun });
});

// ---------- Start ----------
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));