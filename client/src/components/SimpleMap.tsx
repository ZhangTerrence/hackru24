import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Test } from "../types";

const SimpleMap = ({
  latitude,
  longitude,
  data,
}: {
  latitude: number;
  longitude: number;
  data: Test[];
}) => {
  const mapRef = useRef(null);

  return (
    // Make sure you set the height and width of the map container otherwise the map won't show
    <MapContainer
      center={[latitude, longitude]}
      zoom={8}
      ref={mapRef}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        maxZoom="20"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>Your Starting Location</Popup>
      </Marker>
      {data.map((item) => {
        if (item) {
          return (
            <Marker position={[item.location[0], item.location[1]]}>
              <Popup>
                <h3>{item.title}</h3>
                <p>
                  <div style={{ textDecoration: "underline" }}>
                    Required Languages:
                  </div>{" "}
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
