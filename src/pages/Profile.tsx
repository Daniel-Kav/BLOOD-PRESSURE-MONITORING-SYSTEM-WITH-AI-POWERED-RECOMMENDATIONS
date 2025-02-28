import React from 'react';
import ProfileForm from '../components/ProfileForm';

const Profile: React.FC = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-600">
          Manage your personal information and emergency contacts
        </p>
      </div>

      <ProfileForm />
    </div>
  );
};

export default Profile;