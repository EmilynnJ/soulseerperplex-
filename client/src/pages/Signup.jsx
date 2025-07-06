import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="font-alex-brush text-4xl text-mystical-pink mb-2">
            Join SoulSeer
          </h2>
          <p className="font-playfair text-gray-300">
            Create your account to connect with gifted psychics
          </p>
        </div>
        
        <SignUp 
          path="/signup"
          routing="path"
          signInUrl="/login"
          redirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-mystical-darkBlue border border-mystical-purple/30 shadow-mystical",
              headerTitle: "font-alex-brush text-mystical-pink",
              headerSubtitle: "font-playfair text-gray-300",
              formButtonPrimary: "bg-mystical-purple hover:bg-mystical-pink transition-colors",
              footerActionLink: "text-mystical-pink hover:text-pink-300",
              formFieldInput: "bg-mystical-darkBlue/50 border-mystical-purple/30 text-white",
              formFieldLabel: "font-playfair text-gray-300",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButton: "text-mystical-pink hover:text-pink-300"
            },
            layout: {
              socialButtonsVariant: "iconButton",
              socialButtonsPlacement: "bottom"
            }
          }}
        />
      </div>
    </div>
  );
};

export default Signup;
