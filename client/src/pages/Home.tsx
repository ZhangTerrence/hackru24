/* eslint-disable @typescript-eslint/no-explicit-any */
import "../css/Home.css";
import { useState, useEffect } from "react";

import SimpleMap from "../components/SimpleMap";
import myData from "../data.json";
import { setKey, fromAddress } from "react-geocode";
import { Test } from "../types";
import Gemini from "../components/Gemini";

export const Home = () => {
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [userData, setUserData] = useState<Test[]>([]);
  const [reqLang, setReqLang] = useState([]);

  const getCoord = async (location: any) => {
    const geo = await fromAddress(location);
    const res = await geo.results[0].geometry.location;
    return [Number(res.lat), Number(res.lng)];
  };

  useEffect(() => {
    const getData = async () => {
      setKey(import.meta.env.VITE_GOOGLE_API);

      // const test = await fromAddress("Eiffel Tower");
      // const res = test.results[0].geometry.location;
      // console.log([res.lat, res.lng]);

      const newData = myData.info;

      const test = await Promise.all(
        newData.map(async (item) => {
          if (item.location !== "Remote") {
            const res = await getCoord(item.location);

            const object = {
              ...item,
              location: res,
            };

            return object;
          } else {
            return null;
          }
        })
      );
      console.log(test);
      setUserData(test);
    };
    getData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const success = (position: any) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    setUserLatitude(latitude);
    setUserLongitude(longitude);
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
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
              <Gemini setReqLang={setReqLang} />
            </div>
          </div>
          <div className="right">
            {userLatitude && userLongitude ? (
              <SimpleMap
                latitude={userLatitude}
                longitude={userLongitude}
                data={userData}
                queryString={reqLang}
              />
            ) : (
              <div className="r-text-container">
                <div className="r-main-text">Search for jobs around you!</div>
                <div className="r-sub-text">
                  Look for common requirements of jobs near you!
                </div>
                <button onClick={() => handleLocationClick()}>
                  Try it out now!
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
