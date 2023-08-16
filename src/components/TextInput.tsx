"use client"
import React, { FC, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { stat } from 'fs';
import { ProgressBar } from './ProgressBar';

interface TextInputProps {
     placeholder: string;
     value: string;
     onChange: (value: string) => void;
     handleAlert?: () => void;
     removeAll?: () => void;
}

const TextInput: FC<TextInputProps> = ({ placeholder, value, onChange, handleAlert, removeAll }) => {

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

     const handleRemoveAll = () => {
          if (removeAll) {
               removeAll();
          }
     }


     return (
          <div>
               <input disabled={disabled}
                    type='text'
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    className='border p-2 mb-4 w-64  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600'
               />
               <button disabled={disabled} onClick={handleButtonClick} className='bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-4 py-2 rounded-lg ml-4'>
                    Add
               </button>
               <button disabled={disabled} onClick={handleRemoveAll} className='bg-red-400 hover:bg-red-500 transition text-white font-medium  px-4 py-2 rounded-lg ml-4'>
                    Remove All
               </button>
          </div>
     );
};

export default TextInput;
