import { useEffect, useState } from "react";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import UsersList from "../components/UsersList";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:4000/api/users");

        const respData = await response.json();

        if (!response.ok) {
          throw new Error(respData.message);
        }

        console.log(response);
        console.log(respData);

        setData(respData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  const errorHandler = () => setError(null);

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && data && <UsersList items={data} />}
    </>
  );
};

export default Users;
