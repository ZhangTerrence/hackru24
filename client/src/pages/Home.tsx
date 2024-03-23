import { useState } from "react";
import SimpleMap from "../components/SimpleMap";

export const Home = () => {
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);

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
      <button onClick={() => handleLocationClick()}>CLICK ME</button>
      {userLatitude && userLongitude && (
        <div>
          <h2>User Location</h2>
          <p>Latitude: {userLatitude}</p>
          <p>Longitude: {userLongitude}</p>
          <SimpleMap latitude={userLatitude} longitude={userLongitude} />
        </div>
      )}
    </>
  );
};
