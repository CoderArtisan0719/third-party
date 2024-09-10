/* eslint-disable no-alert */
/* eslint-disable no-console */

'use client';

import {
  DirectionsRenderer,
  DirectionsService,
  GoogleMap,
  LoadScript,
  Marker,
} from '@react-google-maps/api';
import React, { useEffect, useState } from 'react';

type PropertyProps = {
  propertyAddress: string;
  countyAccountInfo?: string;
  requestSetter: (item: string, value: any) => void;
};

const Property = (props: PropertyProps) => {
  const googleMapsApiKey =
    process.env.GOOGLE_MAPS_API_KEY ||
    'AIzaSyCIRl7BFpRAtcIy6hwaig3yTOjtHGj-RqA';

  const containerStyle = {
    width: '100%',
    height: '500px',
  };

  const origin = {
    lat: 37.437041393899676,
    lng: -4.191635586788259,
  };

  const [travelTime, setTravelTime] = useState(null);

  const [mapCenter, setMapCenter] = useState<
    google.maps.LatLngLiteral | undefined
  >(origin);

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>();

  const [markerPosition, setMarkerPosition] = useState<
    google.maps.LatLng | google.maps.LatLngLiteral
  >(origin);

  const [mapKey, setMapKey] = useState(0);

  const refreshMap = () => {
    setMapKey((oldKey) => oldKey + 1);
  };

  const directionsCallback = (response: any) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirections(response);
        const route = response.routes[0].legs[0];
        setTravelTime(route.duration.text);
      } else {
        console.error(`Directions request failed due to ${response.status}`);
      }
    }
  };

  useEffect(() => {
    if (!window.google) {
      console.error('Google Maps API is not loaded.');
      return;
    }

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode(
      { address: props.propertyAddress },
      (
        results: google.maps.GeocoderResult[] | null,
        status: google.maps.GeocoderStatus,
      ) => {
        if (status === 'OK' && results?.[0]) {
          const location = results[0].geometry.location.toJSON();
          setMapCenter(location);
          setMarkerPosition(location);
        } else {
          console.error(
            'Geocode was not successful for the following reason: ',
            status,
          );
        }
      },
    );
  }, [props.propertyAddress]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const lat = event.latLng?.lat();
    const lng = event.latLng?.lng();
    if (lat !== undefined && lng !== undefined) {
      setMarkerPosition({ lat, lng });
      const latlng = { lat, lng };

      if (window.google) {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: latlng }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            props.requestSetter(
              'propertyAddress',
              results[0].formatted_address,
            );
          }
        });
      }
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <input
          type="text"
          value={props.propertyAddress}
          onChange={(e) =>
            props.requestSetter('propertyAddress', e.target.value)
          }
          placeholder="Enter an address"
          className="mb-4 w-3/4 rounded border border-gray-500 p-2"
        />

        <button
          onClick={refreshMap}
          className="ml-2 rounded border border-gray-500 bg-primary-deepBlue px-4 py-2 text-white"
        >
          Refresh Map
        </button>
      </div>

      <LoadScript key={mapKey} googleMapsApiKey={googleMapsApiKey}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={10}
          onClick={handleMapClick}
        >
          <Marker position={markerPosition} />

          <DirectionsService
            options={{
              destination: '',
              origin,
              travelMode: window?.google?.maps.TravelMode.DRIVING,
            }}
            callback={directionsCallback}
          />

          {directions && (
            <DirectionsRenderer
              options={{
                directions,
              }}
            />
          )}
        </GoogleMap>

        {travelTime && <p>Estimated travel time: {travelTime}</p>}
      </LoadScript>

      <input
        type="text"
        placeholder="If Available, please enter County Account Informaion"
        className="mt-4 w-5/6 rounded border border-gray-500 p-2"
        value={props.countyAccountInfo}
        onChange={(e) =>
          props.requestSetter('countyAccountInfo', e.target.value)
        }
      />
    </div>
  );
};

export default Property;
