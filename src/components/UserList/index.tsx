import { IUser } from '@/types/user.types';

interface UserListProps {
  users: IUser[];
}

export const UserList = ({ users }: UserListProps) => {
  return (
    <div className="w-64 bg-gray-200 p-2">
      <h3>Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};
