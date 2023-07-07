import { IUser } from '@/types/user.types';
import Link from 'next/link';
import uniqolor from 'uniqolor';

interface UserListProps {
  users: IUser[];
}
export const UserList = ({ users }: UserListProps) => {
  return (
    <div className="no-scrollbar h-full flex-1 overflow-auto border-l-2 border-white p-4">
      <p className="mb-2 px-4 text-lg text-slate-300">Participants</p>
      <div className="rounded-md bg-slate-700 px-4 py-2">
        {users.map((user) => (
          <Link
            target="_blank"
            href={`https://dev.uniresolver.io/#${user.did}`}
            key={user.id}
          >
            <div className="flex cursor-pointer justify-between rounded-md bg-slate-700">
              <p
                className="font-bold"
                style={{
                  color: uniqolor(user.username).color,
                }}
              >
                {user.username}
              </p>
              <p className="self-center text-xs text-slate-500">
                (
                {user.did &&
                  [
                    user.did.split(':').slice(0, 3).join(':'),
                    `${user.did.split(':')[3].slice(0, 6)}...${user.did
                      .split(':')[3]
                      .slice(-4)}`,
                  ].join(':')}
                )
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
