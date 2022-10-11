import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useHttpsClient } from "../../shared/hooks/http-hook";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpsClient();
  const userId = useParams().userId;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const placesData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );

        setLoadedPlaces(placesData.places);
      } catch (error) {}
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeleteHandler = (placeId) => {
    const filteredPlaces = loadedPlaces.filter((place) => place.id !== placeId);

    setLoadedPlaces(filteredPlaces);
  };

  return (
    <>
      <ErrorModal onClear={clearError} error={error} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList onDeletePlace={placeDeleteHandler} items={loadedPlaces} />
      )}
    </>
  );
};

export default UserPlaces;
