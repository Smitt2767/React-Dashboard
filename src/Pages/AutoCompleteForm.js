import React, { useState } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";

const defaultCoords = {
  lat: 20.5937,
  lng: 78.9629,
};

const AutoCompleteForm = () => {
  const [address, setAddress] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [lat, setLat] = useState(defaultCoords.lat);
  const [lng, setLng] = useState(defaultCoords.lng);
  const [isMarkerShown, setIsMarkerShown] = useState(false);
  const [defaultZoom, setDefaultZoom] = useState(4);

  const handleSelect = async (value) => {
    const result = await geocodeByAddress(value);
    const coords = await getLatLng(result[0]);
    if (result.length) {
      clear();

      result[0].address_components.forEach((add_comp) => {
        if (add_comp.types.includes("sublocality_level_2", "sublocality")) {
          setAddress(add_comp.long_name);
        }
        if (add_comp.types.includes("sublocality_level_1", "sublocality")) {
          setAddress2(add_comp.long_name);
        }
        if (
          add_comp.types.includes("locality", "political") ||
          add_comp.types.includes("administrative_area_level_2", "political")
        ) {
          setCity(add_comp.long_name);
        }
        if (
          add_comp.types.includes("administrative_area_level_1", "political")
        ) {
          setState(add_comp.long_name);
        }
        if (add_comp.types.includes("postal_code")) {
          setZipcode(add_comp.long_name);
        }
        if (coords.lat && coords.lng) {
          setLat(coords.lat, coords.lng);
          setLng(coords.lng);
          setIsMarkerShown(true);
          setDefaultZoom(16);
        }
      });
    }
  };

  const clear = () => {
    setAddress("");
    setAddress2("");
    setCity("");
    setState("");
    setZipcode("");
    setLng(defaultCoords.lng);
    setLat(defaultCoords.lat);
    setIsMarkerShown(false);
    setDefaultZoom(4);
  };

  const MyMapComponent = withGoogleMap((props) => (
    <GoogleMap defaultZoom={defaultZoom} defaultCenter={{ lat, lng }}>
      {props.isMarkerShown && <Marker position={{ lat, lng }} />}
    </GoogleMap>
  ));

  return (
    <div className="w-full py-4 px-4 lg:px-8 flex items-start flex-col overflow-y-auto">
      <h1 className="text-4xl text-gray-800 hover:text-gray-500 cursor-pointer mb-8">
        Contact Us
      </h1>
      <div className="flex items-center justify-center w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-10 border-2 border-gray-100 rounded-lg">
          <div className="flex flex-col bg-gray-50 px-5 py-4 shadow-xl w-full md:w-96 max-w-xl">
            <h1 className="font-bold text-3xl text-center mb-8">
              Autocomplete Form
            </h1>
            <PlacesAutocomplete
              value={address}
              onChange={setAddress}
              onSelect={handleSelect}
            >
              {({
                getInputProps,
                suggestions,
                getSuggestionItemProps,
                loading,
              }) => {
                return (
                  <div className="w-full my-3 relative">
                    <input
                      {...getInputProps({
                        placeholder: "address",
                        className:
                          "h-12 px-5 focus:outline-none border-2 border-gray-400 rounded-lg w-full",
                      })}
                    />
                    {suggestions.length ? (
                      <div className="bg-gray-200 mt-1 absolute w-full border-2 border-gray-400">
                        {loading && (
                          <div className="bg-gray-100 px-4 py-2">
                            Loading...
                          </div>
                        )}
                        {suggestions.map((suggestion) => {
                          const className = suggestion.active
                            ? "bg-gray-600 text-white cursor-pointer px-4 py-2"
                            : "bg-gray-100 cursor-pointer px-4 py-2";
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                              })}
                              key={suggestion.placeId}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                );
              }}
            </PlacesAutocomplete>
            <input
              type="text"
              placeholder="address2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="my-3 h-12 px-5 focus:outline-none border-2 border-gray-400 rounded-lg"
            />
            <input
              type="text"
              placeholder="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="my-3 h-12 px-5 focus:outline-none border-2 border-gray-400 rounded-lg"
            />
            <input
              type="text"
              placeholder="state"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="my-3 h-12 px-5 focus:outline-none border-2 border-gray-400 rounded-lg"
            />
            <input
              type="text"
              placeholder="zipcode"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              className="my-3 h-12 px-5 focus:outline-none border-2 border-gray-400 rounded-lg"
            />
            <div className="flex justify-between items-center mt-8">
              <button className="bg-blue-500 focus:outline-none border-none rounded-lg text-white px-12 py-2 font-bold">
                Submit
              </button>
              <button
                className="bg-red-500 focus:outline-none border-none rounded-lg text-white px-12 py-2 font-bold"
                onClick={clear}
              >
                Clear
              </button>
            </div>
          </div>

          <MyMapComponent
            isMarkerShown={isMarkerShown}
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={
              <div className="shadow-xl w-full md:w-96 h-96 md:h-full" />
            }
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    </div>
  );
};

export default AutoCompleteForm;
