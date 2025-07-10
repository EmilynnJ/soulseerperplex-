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
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-mystical-darkBlue border border-mystical-purple/30 shadow-mystical",
              headerTitle: "font-alex-brush text-mystical-pink",
              headerSubtitle: "font-playfair text-gray-300",
              formButtonPrimary: "bg-mystical-purple hover:bg-mystical-pink transition-colors text-white",
              formButtonSecondary: "text-mystical-pink hover:text-pink-300",
              footerActionLink: "text-mystical-pink hover:text-pink-300",
              formFieldInput: "bg-mystical-darkBlue/50 border-mystical-purple/30 text-black placeholder-gray-400",
              formFieldLabel: "font-playfair text-gray-300",
              formFieldInputShowPasswordButton: "text-mystical-pink hover:text-pink-300",
              formFieldAction: "text-mystical-pink hover:text-pink-300",
              formFieldWarning: "text-yellow-400",
              formFieldError: "text-red-400",
              formFieldSuccessText: "text-green-400",
              formFieldHintText: "text-gray-400",
              socialButtonsBlockButton: "text-white bg-mystical-darkBlue/50 border-mystical-purple/30 hover:bg-mystical-purple/50",
              socialButtonsBlockButtonText: "text-white",
              dividerText: "text-gray-300",
              otpCodeFieldInput: "bg-mystical-darkBlue/50 border-mystical-purple/30 text-black",
              identityPreviewText: "text-gray-300",
              identityPreviewEditButton: "text-mystical-pink hover:text-pink-300",
              main: "text-white",
              cardBox: "text-white"
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
