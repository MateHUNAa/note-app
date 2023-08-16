import React from 'react'

export const ProgressBar: React.FC = () => {
     return (
          <div className="flex items-center justify-center h-screen">
               <div className="w-40 h-4 bg-gray-200 rounded-full relative">
                    <div className="absolute top-0 left-0 h-full bg-blue-500 rounded-full animate-progress"></div>
               </div>
          </div>
     );
}

