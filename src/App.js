import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent  } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import osm from "./osm-providers";
import './App.css'
import useGeoLocation from "./useGeoLocation"
import "leaflet-routing-machine";
const markerIcon = new L.Icon({   
  iconUrl: require("./asset/image/maker_user.png"),
  iconSize: [40, 40],
  iconAnchor: [17, 46], //[left/right, top/bottom]
  popupAnchor: [0, -46], //[left/right, top/bottom]
});
const markerIcon1 = new L.Icon({   
  iconUrl: require("./asset/image/marker.png"),
  iconSize: [40, 40],
  iconAnchor: [17, 46], //[left/right, top/bottom]
  popupAnchor: [0, -46], //[left/right, top/bottom]
});

const App = () => {
  const [center, setCenter] = useState({ lat: 10.779348472547028, lng: 106.71172379356236 });
  const ZOOM_LEVEL = 10;
  const mapRef = useRef();

  const location = useGeoLocation();

  const showMyLocation = () => {
    if (location.loaded && !location.error) {
      mapRef.current.flyTo(
        [location.coordinates.lat, location.coordinates.lng],
        ZOOM_LEVEL,
        { animate: true }
      );
    } else {
      alert(location.error.message);
    }
  };
  
  const [locationClick, setlocationClick] = useState({ lat: 10.779348472547028, lng: 106.71172379356236 });
  const [routingControl, setRoutingControl] = useState(null);

  const handleMapClickGetLocation = (e) => {
            setlocationClick({ lat: e.latlng.lat, lng: e.latlng.lng } );

};
const handleDisplayRoute=()=>{
 
    if (routingControl) {
        routingControl.getPlan().setWaypoints([
          L.latLng(location.coordinates.lat, location.coordinates.lng),
          L.latLng(locationClick.lat, locationClick.lng)
    ])} 

    else {
              let routing = L.Routing.control({
              waypoints: [
                  L.latLng(location.coordinates.lat, location.coordinates.lng),
                  L.latLng(locationClick.lat, locationClick.lng)
              ],
              lineOptions: {
                styles: [
                  {
                    color: "blue",
                    opacity: 0.6,
                    weight: 4
                  }
                ]
              },
              routeWhileDragging: true,
              addWaypoints: false,
              draggableWaypoints: false,
              fitSelectedRoutes: false,
              showAlternatives: false,
              createMarker: function() { return null; }
            
    });
    // routing = L.Routing.control({ createMarker: function() { return null; } });

    routing.addTo(mapRef.current);
    setRoutingControl(routing);
    }

}

  return (
    <>
      <div className="row">
        <div className="col text-center">
          <h2>React-leaflet - Get user location</h2>
          <p>Get user location and highlight it with a marker</p>
          <div className="col">
            <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
              <TileLayer
                url={osm.maptiler.url}
                attribution={osm.maptiler.attribution}
              />
               <MyClickHandlerGetLocation onClick={handleMapClickGetLocation} />
              {location.loaded && !location.error && (
                <Marker
                  icon={markerIcon}
                  position={[
                    location.coordinates.lat,
                    location.coordinates.lng,
                  ]}
                ></Marker>
              )}
              <Marker
                  icon={markerIcon1}
                  position={[
                    locationClick.lat,
                    locationClick.lng,
                  ]}
                ></Marker>
                <Marker
                  icon={markerIcon}
                  position={[
                    location.coordinates.lat,
                    location.coordinates.lng,
                  ]}
                ></Marker>
            </MapContainer>
          </div>
        </div>
      </div>
      <div className="row my-4">
        <div className="col d-flex justify-content-center">
          <button className="btn btn-primary" onClick={showMyLocation}>
            Locate Me
          </button>
          <button className="btn btn-primary" onClick={handleDisplayRoute}>
            Chỉ đường
          </button>
        </div>
      </div>
    </>
  );
};
function MyClickHandlerGetLocation({ onClick }) {
  const map = useMapEvent('click', (e) => {
    onClick(e);
  });
  
  return null;
  }

export default App;