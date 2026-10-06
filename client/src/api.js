async function request(url, options) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong");
  return data;
}

export const getTeams = () => request("/api/teams");

export const createTeam = (team) =>
  request("/api/teams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(team),
  });

export const createRun = (run) =>
  request("/api/runs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(run),
  });

export const getLeaderboard = (round) =>
  request(`/api/leaderboard?round=${round}`);