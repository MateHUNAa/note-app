"use client"
import React, { FC, useState } from 'react';
import { useSession } from 'next-auth/react';
import { ProgressBar } from '../../ProgressBar';
import { Roles } from '@prisma/client';

interface TextInputProps {
     placeholder: string;
     value: string;
     onChange: (value: string) => void;
     handleAlert?: () => void;
     removeAll?: (admin: boolean) => void;
     role: Roles
}

const TextInput: FC<TextInputProps> = ({ placeholder, value, onChange, handleAlert, removeAll, role }) => {

     const [disabled, setDisabled] = useState<boolean>();
     const { data: session, status } = useSession();

     if (status === 'loading') {
          return (
               <ProgressBar />
          )
     }


     if (session?.user && disabled) {
          setDisabled(false);
     } else if (!session?.user && !disabled) {
          setDisabled(true);
     }

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
     };

     const handleButtonClick = () => {
          if (handleAlert) {
               handleAlert();
          }
     };

     const handleRemoveAll = (admin: boolean) => {
          if (removeAll) {
               removeAll(admin);
          }
     }


     return (
          <div className=''>
               <input disabled={disabled}
                    type='text'
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    className='border p-2 mb-4 w-64  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
               />
               <button disabled={disabled} onClick={handleButtonClick} className='bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-4 py-2 rounded-lg ml-4 w-24 tracking-widest'>
                    Add
               </button>
               {role === Roles.ADMIN ? (
                    <div>
                         <button disabled={disabled} onClick={(e) => handleRemoveAll(false)} className='bg-red-400 hover:bg-red-500 transition text-white font-medium  px-4 py-2 rounded-lg ml-4'>
                              Remove Ours
                         </button>
                         <button disabled={disabled} onClick={(e) => handleRemoveAll(true)} className='border-black border-4 bg-red-500 hover:bg-red-950 transition text-white font-medium  px-4 py-2 rounded-lg ml-4'>
                              Remove All
                              <br />
                              <p className='text-black font-bold tracking-[.3em] text-sm'>ADMIN</p>
                         </button>
                    </div>
               ) : (

                    <button disabled={disabled} onClick={() => handleRemoveAll(false)} className='bg-red-400 hover:bg-red-500 transition text-white font-medium  px-4 py-2 rounded-lg ml-4 w-fit'>
                         Remove All
                    </button>

               )}

          </div>
     );
};

export default TextInput;
