import React from 'react';
import { Illustration } from '../components/ui/Icons';

interface AuthProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  copyright?: React.ReactNode;
}

const Auth: React.FC<AuthProps> = ({ children, footer, copyright }) => {
  return (
    <div className="h-screen w-full bg-primary-100 flex overflow-hidden font-sans">
      
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center items-center p-4 lg:p-8 relative z-10">
        <div className="bg-white w-full h-full rounded-[32px] shadow-none flex flex-col items-center border border-white/50 relative">
          <div className="flex-1 flex flex-col justify-center w-full items-center px-4">
            <div className="w-full max-w-[350px]">
              {children}
              
              {footer && (
                <div className="mt-8 text-center w-full">
                  {footer}
                </div>
              )}
            </div>
          </div>

          {copyright && (
            <div className="w-full text-center pb-8 shrink-0">
              {copyright}
            </div>
          )}

        </div>
      </div>

      <div className="hidden lg:flex w-1/2 h-full flex-col justify-center items-center p-8 relative">
        <div className="w-[400px] max-w-full h-auto">
           <Illustration className="w-full h-auto drop-shadow-xl" />
        </div>
      </div>

    </div>
  );
};

export default Auth;