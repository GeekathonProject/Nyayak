import { MapContainer, TileLayer, Circle, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

const MapComponent = () => {
  const [locations, setLocations] = useState([]);
  const [markMode, setMarkMode] = useState(null); // 'dangerous' or 'safe'

  const fetchLocations = async () => {
    const { data } = await supabase.from('location_safety').select('*');
    setLocations(data || []);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        if (!markMode) return;
        const { lat, lng } = e.latlng;
        await supabase.from('location_safety').insert([
          { latitude: lat, longitude: lng, type: markMode }
        ]);
        fetchLocations();
      },
    });
    return null;
  };

  return (
    <div>
      <button onClick={() => setMarkMode('dangerous')}>Mark Dangerous</button>
      <button onClick={() => setMarkMode('safe')}>Mark Safe</button>
      <MapContainer center={[22.5726, 88.3639]} zoom={13} style={{ height: '80vh' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        {locations.map((loc) => (
          <Circle
            key={loc.id}
            center={[loc.latitude, loc.longitude]}
            radius={50}
            color={loc.type === 'dangerous' ? 'red' : 'green'}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
