import "./assets/css/global.css";

import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import { Search, MapPin, ExternalLink, X } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para os ícones do Leaflet
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Dados mockados
const mockPings = [
  {
    id: 1,
    name: "Cristo Redentor",
    latitude: -22.9519,
    longitude: -43.2105,
    media: "https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=300&h=200&fit=crop",
    type: "image"
  },
  {
    id: 2,
    name: "Torre Eiffel",
    latitude: 48.8584,
    longitude: 2.2945,
    media: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=300&h=200&fit=crop",
    type: "image"
  },
  {
    id: 3,
    name: "Estátua da Liberdade",
    latitude: 40.6892,
    longitude: -74.0445,
    media: "https://images.unsplash.com/photo-1508974239320-0a029497e820?w=300&h=200&fit=crop",
    type: "image"
  },
  {
    id: 4,
    name: "Big Ben",
    latitude: 51.5007,
    longitude: -0.1246,
    media: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop",
    type: "image"
  },
  {
    id: 5,
    name: "Sydney Opera House",
    latitude: -33.8568,
    longitude: 151.2153,
    media: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
    type: "image"
  }
];

const MapController = ({ center, zoom }) => {
  const map = useRef();
  
  useEffect(() => {
    if (map.current) {
      map.current.setView(center, zoom);
    }
  }, [center, zoom]);

  return null;
};

export function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPing, setSelectedPing] = useState(null);
  const [mapCenter, setMapCenter] = useState([0, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const mapRef = useRef();

  // Filtrar pings baseado na busca
  const filteredPings = mockPings.filter(ping =>
    ping.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Função para centralizar o mapa em um ping
  const centerMapOnPing = (ping) => {
    setMapCenter([ping.latitude, ping.longitude]);
    setMapZoom(10);
    setSelectedPing(ping);
  };

  const MapController = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
      if (center && map) {
        map.setView(center, zoom);
      }
    }, [center, zoom, map]);

    return null;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Barra Lateral */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <MapPin className="mr-2 text-blue-600" />
            Mapa Interativo
          </h1>
          
          {/* Campo de Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar pings..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Lista de Pings */}
        <div className="flex-1 overflow-y-auto p-4">
          <h2 className="font-semibold text-gray-700 mb-3">
            Pings ({filteredPings.length})
          </h2>
          
          <div className="space-y-3">
            {filteredPings.map((ping) => (
              <div
                key={ping.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedPing?.id === ping.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => centerMapOnPing(ping)}
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={ping.media}
                    alt={ping.name}
                    className="w-16 h-12 object-cover rounded-md flex-shrink-0"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64x48?text=No+Image';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {ping.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {ping.latitude.toFixed(4)}, {ping.longitude.toFixed(4)}
                    </p>
                    <a
                      href={ping.media}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 mt-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Ver mídia
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum ping encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Área do Mapa */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="w-full h-full z-10"
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {filteredPings.map((ping) => (
            <Marker
              key={ping.id}
              position={[ping.latitude, ping.longitude]}
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedPing(ping)
              }}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <img
                    src={ping.media}
                    alt={ping.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {ping.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {ping.latitude.toFixed(4)}, {ping.longitude.toFixed(4)}
                  </p>
                  <a
                    href={ping.media}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Ver mídia completa
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
          
          <MapController center={mapCenter} zoom={mapZoom} />
        </MapContainer>

        {/* Informações do Ping Selecionado */}
        {selectedPing && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm z-90">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{selectedPing.name}</h3>
                <p className="text-sm text-gray-600">
                  {selectedPing.latitude.toFixed(4)}, {selectedPing.longitude.toFixed(4)}
                </p>
              </div>
              <button
                onClick={() => setSelectedPing(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}