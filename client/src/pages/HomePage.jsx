export default function HomePage() {
  return (
    <div className="home">
      <div className="home-inner">
        <p className="home-tag">Line Follower Robot Competition</p>
        <h1>🏁 RaceDay Live</h1>
        <p className="home-sub">
          Live scoring and an auto-updating leaderboard. No more whiteboards.
        </p>

        <div className="home-buttons">
          <a href="#admin" className="home-card">
            <span className="home-card-title">Admin</span>
            <span className="home-card-text">
              Register teams, record runs and manage results.
            </span>
          </a>

          <a href="#projector" className="home-card">
            <span className="home-card-title">Projector View</span>
            <span className="home-card-text">
              Full-screen live leaderboard for the audience.
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}