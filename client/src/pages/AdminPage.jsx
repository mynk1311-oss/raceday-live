import { useState, useEffect } from "react";
import { getTeams } from "../api";
import TeamForm from "../components/TeamForm";
import RunForm from "../components/RunForm";

export default function AdminPage() {
  const [teams, setTeams] = useState([]);

  async function loadTeams() {
    setTeams(await getTeams());
  }

  useEffect(() => {
    loadTeams();
  }, []);

  return (
    <div className="admin">
      <TeamForm onCreated={loadTeams} />
      <RunForm teams={teams} />
    </div>
  );
}