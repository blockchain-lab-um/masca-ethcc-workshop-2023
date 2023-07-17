import { IUser } from '@/types/user.types';
import Link from 'next/link';
import uniqolor from 'uniqolor';

interface UserListProps {
  users: IUser[];
}
const UserList = ({ users }: UserListProps) => {
  return (
    <div className="no-scrollbar h-full flex-1 overflow-auto rounded-xl bg-slate-700 p-4 shadow-sm">
      <div>
        <p className="mb-2 px-4 text-lg text-slate-300">Participants</p>
      </div>
      <div className="overflow-auto rounded-md bg-slate-600 px-4 py-2">
        {users.map((user) => (
          <Link
            target="_blank"
            href={`https://dev.uniresolver.io/#${user.did}`}
            key={user.id}
          >
            <div className="flex cursor-pointer justify-between">
              <p
                className="font-bold"
                style={{
                  color: uniqolor(user.username).color,
                }}
              >
                {user.username}
              </p>
              <p className="self-center text-xs text-slate-500">
                {user.did &&
                  `${user.did.substring(0, did.lastIndexOf(':'))}:${user.did
                    .split(':')
                    [user.did.split(':').length - 1].slice(0, 5)}...${user.did.slice(
                    -4
                  )}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default UserList;
