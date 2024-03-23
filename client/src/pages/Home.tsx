import "../css/Home.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const success = (position: any) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setUserLatitude(latitude);
    setUserLongitude(longitude);
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    navigate("/searchJobs");
  };

  const error = () => {
    console.log("Unable to retrieve your location");
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
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
            </div>
          </div>
          <div className="right">
            <div className="r-text-container">
              <div className="r-main-text">Search for jobs around you!</div>
              <div className="r-sub-text">
                Look for common requirements of jobs near you!
              </div>
              <button onClick={() => handleLocationClick()}>
                Allow location
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
