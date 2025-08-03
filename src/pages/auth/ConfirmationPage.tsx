import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';

const ConfirmationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-blue-600">
          Check your email
        </h1>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <div className="rounded-full bg-green-100 p-3 mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Confirmation email sent!
          </h2>
          
          <p className="text-gray-600 mb-6">
            We've sent a confirmation email to your address. Please check your inbox and click the confirmation link to activate your account.
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or try signing in - you might already be confirmed.
            </p>
            
            <Link to="/login">
              <button className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Return to login
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage; 