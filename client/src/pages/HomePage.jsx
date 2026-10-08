export default function HomePage() {
  return (
    <div className="landing">
      <div className="streaks">
        <div className="streak"></div>
        <div className="streak"></div>
        <div className="streak"></div>
        <div className="streak"></div>
        <div className="streak"></div>
        <div className="streak"></div>
        <div className="streak"></div>
      </div>

      <div className="landing-content">
        <h1>
          Race<span>Day</span> Live
        </h1>

        <div className="landing-buttons">
          <a href="#admin" className="btn-primary">
            Go to Admin
          </a>
        </div>
      </div>
    </div>
  );
}