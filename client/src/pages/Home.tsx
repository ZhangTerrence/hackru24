import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import { Upload } from "../components/Upload";

export const Home = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/searchJobs", { state: { key: "value" } });
  };

  return (
    <>
      <section className="home">
        <nav className="nav">
          <div className="logo">HackRU</div>
          <ul className="nav-list">
            <a href="https://hackru-spring-2024.devpost.com/">
              <li className="nav-list-item">Devpost</li>
            </a>
          </ul>
        </nav>

        <div className="main-section">
          <div className="left">
            <div className="l-text-container">
              <div className="l-main-text">Resume Review</div>
              <div className="l-sub-text">
                Improve your resume using our AI-powered assistant
              </div>
              <Upload />
            </div>
          </div>
          <div className="right">
            <div className="r-text-container">
              <div className="r-main-text">Search for jobs around you!</div>
              <div className="r-sub-text">
                Look for common requirements of jobs near you!
              </div>
              <button onClick={() => handleClick()}>Try it out now!</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
