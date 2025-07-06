import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h2 className="font-alex-brush text-4xl text-mystical-pink mb-2">
            Welcome Back
          </h2>
          <p className="font-playfair text-gray-300">
            Sign in to your SoulSeer account
          </p>
        </div>
        
        <SignIn 
          path="/login"
          routing="path"
          signUpUrl="/signup"
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

export default Login;
