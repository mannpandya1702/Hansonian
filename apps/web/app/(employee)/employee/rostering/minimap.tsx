"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

const employeeIcon = new L.DivIcon({
  html: `
    <div style="
      background:#1A56DB;
      width:30px;
      height:30px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      color:white;
      font-size:16px;
      box-shadow:0 4px 10px rgba(0,0,0,0.2);
    ">
      👤
    </div>
  `,
  className: "",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

export default function MiniMap({ location }: { location: { lat: number; lng: number } }) {
  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "150px", width: "100%", borderRadius: "16px" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[location.lat, location.lng]} icon={employeeIcon} />
    </MapContainer>
  );
}
