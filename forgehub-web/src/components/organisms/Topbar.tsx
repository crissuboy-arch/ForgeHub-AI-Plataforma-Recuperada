// src/components/organisms/Topbar.tsx
import React from 'react';
import { Icon } from '../atoms/Icon';
import { Typography } from '../atoms/Typography';
import { useAuth } from '../../hooks/useAuth';
import classNames from 'classnames';

/**
 * Top navigation bar displayed across the app.
 * Shows the app logo/name on the left and user avatar/logout on the right.
 */
export const Topbar: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header
      className={classNames(
        'flex items-center justify-between px-4 py-2 bg-white shadow-sm',
        'border-b border-gray-200',
      )}
    >
      <div className="flex items-center space-x-2">
        <Icon name="home" className="text-indigo-600" size={24} />
        <Typography variant="h5" className="font-semibold text-gray-800">
          ForgeHub AI
        </Typography>
      </div>
      {user && (
        <button
          onClick={signOut}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <Icon name="user" size={20} />
          <Typography variant="small">{user.email}</Typography>
          <Icon name="logout" size={20} />
        </button>
      )}
    </header>
  );
};
