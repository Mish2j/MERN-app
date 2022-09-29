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
          `http://localhost:4000/api/places/user/${userId}`
        );

        setLoadedPlaces(placesData.places);
      } catch (error) {}
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  return (
    <>
      <ErrorModal onClear={clearError} error={error} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} />}
    </>
  );
};

export default UserPlaces;
