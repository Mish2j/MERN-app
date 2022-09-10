import UserItem from "./UserItem";

import "./UsersList.css";

const UsersList = ({ items }) => {
  const noUsersFound = (
    <div className="center">
      <h2>No users found.</h2>
    </div>
  );

  const users = items.map((user) => (
    <ul>
      <UserItem
        key={user.id}
        id={user.id}
        image={user.image}
        name={user.name}
        placeCount={user.places}
      />
    </ul>
  ));

  return items.length === 0 ? noUsersFound : users;
};

export default UsersList;
