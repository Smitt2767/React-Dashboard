import React from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

const GooglePlacesAutoComplete = ({
  formik,
  lableName,
  required,
  errorMessage,
}) => {
  const clear = () => {
    formik.setFieldValue("address", "");
    formik.setFieldValue("address2", "");
    formik.setFieldValue("city", "");
    formik.setFieldValue("state", "");
    formik.setFieldValue("zipcode", "");
  };

  const handleSelect = async (value) => {
    const result = await geocodeByAddress(value);
    if (result.length) {
      clear();

      result[0].address_components.forEach((add_comp) => {
        if (add_comp.types.includes("sublocality_level_2", "sublocality")) {
          formik.setFieldValue("address", add_comp.long_name);
        }
        if (add_comp.types.includes("sublocality_level_1", "sublocality")) {
          formik.setFieldValue("address2", add_comp.long_name);
        }
        if (
          add_comp.types.includes("locality", "political") ||
          add_comp.types.includes("administrative_area_level_2", "political")
        ) {
          formik.setFieldValue("city", add_comp.long_name);
        }
        if (
          add_comp.types.includes("administrative_area_level_1", "political")
        ) {
          formik.setFieldValue("state", add_comp.long_name);
        }
        if (add_comp.types.includes("postal_code")) {
          formik.setFieldValue("zipcode", add_comp.long_name);
        }
      });
    }
  };

  return (
    <div className="flex flex-col lg:mr-4 md:mr-2 mr-0 w-full mb-2 lg:mb-0">
      <label className="text-sm lg:text-lg font-bold text-gray-700 mb-1">
        {lableName} {required ? <span className="text-red-500">*</span> : null}
      </label>
      <PlacesAutocomplete
        value={formik.values.address || ""}
        onChange={(value) => formik.setFieldValue("address", value)}
        onSelect={handleSelect}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
          return (
            <div className="w-full relative">
              <input
                {...getInputProps({
                  placeholder: "address",
                  className:
                    "focus:outline-none text-sm p-2 bg-gray-100 border border-gray-400 rounded-md text-gray-700 w-full",
                })}
                name="address"
                onBlur={formik.handleBlur}
              />

              {suggestions.length ? (
                <div className="bg-gray-200 mt-1 absolute w-full border-2 border-gray-400">
                  {loading && <div className="bg-gray-100 p-2">Loading...</div>}
                  {suggestions.map((suggestion) => {
                    const className = suggestion.active
                      ? "bg-gray-600 text-white cursor-pointer p-2 text-sm"
                      : "bg-gray-100 cursor-pointer p-2 text-sm";
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
      <p className="text-red-500 text-sm pl-1">{errorMessage}</p>
    </div>
  );
};

export default GooglePlacesAutoComplete;
