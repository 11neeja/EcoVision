import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, ExternalLink, Phone, Clock } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

interface DisposalCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  acceptedItems: string[];
  distance: number;
  rating: number;
  website?: string;
}

interface LocationFinderProps {
  itemCategory?: string;
}

const LocationFinder: React.FC<LocationFinderProps> = ({ itemCategory }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [disposalCenters, setDisposalCenters] = useState<DisposalCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  
  const { showSuccess, showError, showInfo } = useNotifications();

  // Mock disposal centers data
  const mockDisposalCenters: DisposalCenter[] = [
    {
      id: '1',
      name: 'EcoRecycle Center',
      address: '123 Green Street, San Francisco, CA 94102',
      phone: '(415) 555-0123',
      hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-4PM',
      acceptedItems: ['Batteries', 'Mobile Devices', 'Computer Hardware', 'Cables'],
      distance: 0.8,
      rating: 4.8,
      website: 'https://ecorecycle.com'
    },
    {
      id: '2',
      name: 'Best Buy Recycling',
      address: '456 Tech Avenue, San Francisco, CA 94103',
      phone: '(415) 555-0456',
      hours: 'Mon-Sun: 10AM-9PM',
      acceptedItems: ['Mobile Devices', 'Computer Hardware', 'Display Devices', 'Cables'],
      distance: 1.2,
      rating: 4.5
    },
    {
      id: '3',
      name: 'Green Earth Disposal',
      address: '789 Eco Way, San Francisco, CA 94104',
      phone: '(415) 555-0789',
      hours: 'Mon-Fri: 7AM-5PM',
      acceptedItems: ['Batteries', 'Hazardous Materials', 'All Electronics'],
      distance: 2.1,
      rating: 4.9,
      website: 'https://greenearth.com'
    }
  ];

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if ('geolocation' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermission(permission.state);
      } catch (error) {
        console.error('Error checking location permission:', error);
      }
    }
  };

  const getCurrentLocation = () => {
    if (!('geolocation' in navigator)) {
      showError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    showInfo('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        findNearbyDisposalCenters(latitude, longitude);
        showSuccess('Location found! Searching for nearby disposal centers...');
      },
      (error) => {
        setLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            showError('Location access denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            showError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            showError('Location request timed out.');
            break;
          default:
            showError('An unknown error occurred while retrieving location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const findNearbyDisposalCenters = async (lat: number, lng: number) => {
    try {
      // Simulate API call to find nearby disposal centers
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Filter centers based on item category if provided
      let filteredCenters = mockDisposalCenters;
      if (itemCategory) {
        filteredCenters = mockDisposalCenters.filter(center =>
          center.acceptedItems.some(item => 
            item.toLowerCase().includes(itemCategory.toLowerCase()) ||
            itemCategory.toLowerCase().includes(item.toLowerCase())
          )
        );
      }

      // Sort by distance
      const sortedCenters = filteredCenters.sort((a, b) => a.distance - b.distance);
      
      setDisposalCenters(sortedCenters);
      setLoading(false);
      
      if (sortedCenters.length > 0) {
        showSuccess(`Found ${sortedCenters.length} disposal centers near you!`);
      } else {
        showError('No disposal centers found for this item type in your area.');
      }
    } catch (error) {
      setLoading(false);
      showError('Failed to find disposal centers. Please try again.');
    }
  };

  const openInMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  const callCenter = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-eco-100 to-eco-200 rounded-xl flex items-center justify-center mr-4">
          <MapPin className="w-6 h-6 text-eco-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Find Disposal Centers</h3>
          <p className="text-gray-600">
            {itemCategory ? `For ${itemCategory} disposal` : 'Locate nearby e-waste recycling facilities'}
          </p>
        </div>
      </div>

      {!userLocation ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Enable Location Access</h4>
          <p className="text-gray-600 mb-6">
            Allow location access to find disposal centers near you
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getCurrentLocation}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-eco-500 to-eco-600 text-white rounded-lg font-semibold hover:from-eco-600 hover:to-eco-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Finding Location...
              </div>
            ) : (
              'Get My Location'
            )}
          </motion.button>
        </div>
      ) : (
        <div className="space-y-4">
          {disposalCenters.length === 0 && !loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No disposal centers found yet.</p>
              <button
                onClick={() => findNearbyDisposalCenters(userLocation.lat, userLocation.lng)}
                className="px-4 py-2 text-eco-600 hover:text-eco-700 font-medium transition-colors"
              >
                Search Again
              </button>
            </div>
          ) : (
            disposalCenters.map((center) => (
              <motion.div
                key={center.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{center.name}</h4>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={i < Math.floor(center.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">({center.rating})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-eco-600">{center.distance} mi</div>
                    <div className="text-xs text-gray-500">away</div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{center.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{center.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{center.hours}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">Accepted Items:</div>
                  <div className="flex flex-wrap gap-1">
                    {center.acceptedItems.map((item, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded-full ${
                          itemCategory && (
                            item.toLowerCase().includes(itemCategory.toLowerCase()) ||
                            itemCategory.toLowerCase().includes(item.toLowerCase())
                          )
                            ? 'bg-eco-100 text-eco-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openInMaps(center.address)}
                    className="flex-1 px-3 py-2 bg-eco-500 text-white rounded-lg hover:bg-eco-600 transition-colors text-sm font-medium flex items-center justify-center"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => callCenter(center.phone)}
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    Call
                  </motion.button>
                  {center.website && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => window.open(center.website, '_blank')}
                      className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LocationFinder;