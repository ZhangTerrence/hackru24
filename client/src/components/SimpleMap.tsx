import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { Data } from "../types";
import "leaflet/dist/leaflet.css";

const SimpleMap = ({
  latitude,
  longitude,
  data,
  queryString,
}: {
  latitude: number;
  longitude: number;
  data: Data[];
  queryString: string[];
}) => {
  const mapRef = useRef(null);

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={8}
      ref={mapRef}
      style={{ height: "100%", width: "100%", borderRadius: "2rem" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/%7Bz%7D/%7Bx%7D/%7By%7D.png"
        maxZoom={20}
      />
      <Marker position={[latitude, longitude]}>
        <Popup>Your Starting Location</Popup>
      </Marker>

      {data.map((item) => {
        if (item && queryString.some((skill) => item.skills.includes(skill))) {
          return (
            <Marker position={[item.location[0], item.location[1]]}>
              <Popup>
                <h3>{item.title}</h3>
                <p>
                  <div style={{ textDecoration: "underline" }}>
                    Required Languages:
                  </div>
                  {item.skills.join(", ")}
                </p>
              </Popup>
            </Marker>
          );
        }
      })}
    </MapContainer>
  );
};

export default SimpleMap;
