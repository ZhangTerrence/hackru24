import { useState } from "react";
import SimpleMap from "../components/SimpleMap";

export const Map = ({
  userLatitude,
  userLongitude,
}: {
  userLatitude: number;
  userLongitude: number;
}) => {
  return (
    <>
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
