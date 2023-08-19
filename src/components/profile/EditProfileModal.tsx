import React, { FC, FormEvent, useState } from 'react';
import Draggable from 'react-draggable';
import { useToast } from '../ui/use-toast';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { UsernameValidator } from '@/lib/validators/username';
import AccountLinkModal from './AccountLinkModal';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { ZodError } from 'zod';



interface EditProfileModalProps {
     isOpen: boolean;
     onClose: () => void;
}


const EditProfileModal: FC<EditProfileModalProps> = ({ isOpen, onClose }) => {

     const [username, setName] = useState(''); // State for the edited name
     const [showTwitterModal, setShowTwitterModal] = useState(false);
     const [showInstagramModal, setShowInstagramModal] = useState(false);
     const inputRef = React.useRef<HTMLInputElement>(null);

     const { toast } = useToast();

     const { mutate: updateUser } = useMutation(async (newUsername: string) => {


          const { username: validatedName } = UsernameValidator.parse({
               username: newUsername,
          });

          const response = await axios.patch("/api/username", {
               username: validatedName,
          });

          return response.data;



     }, {
          onSuccess: (data) => {
               toast({
                    title: "Success!",
                    description: "Your username has been updated.",
               });
               if (inputRef.current) {
                    setName('');
                    inputRef.current.value = '';
               }
               onClose();
          },
          onError: (error) => {
               if (error instanceof ZodError) {
                    return toast({
                         title: "Error Updating Profile",
                         description: error.issues[0].message,
                         variant: "destructive",
                         duration: 2000
                    })
               }
               if (error instanceof AxiosError) {
                    if (error.response?.status === 429) {
                         return toast({
                              title: "Error Updating Profile",
                              description: "You are being rate limited. Please try again later.",
                              variant: "destructive",
                              duration: 2000
                         })
                    }
               }
               return toast({
                    title: "Something went wrong!",
                    description: "Please try again later!",
                    variant: "destructive",
                    duration: 2000
               });
          }
     });


     const handleNameChange = (e: any) => {
          setName(e.target.value);
     };

     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          if (!username) return toast({
               title: "Error Updating Profile",
               description: "Name cannot be empty",
               variant: "destructive",
               duration: 1000
          })

          updateUser(username);


     };

     return (
          <div className={`fixed left-36 inset-0 flex items-center justify-center ${isOpen ? '' : 'hidden'}`}>
               <Draggable handle=".modal-drag-handle" cancel=".modal-no-drag">
                    <div className="bg-white p-6 rounded-lg shadow-md modal-drag-handle ring-2">
                         <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                         <form onSubmit={(e) => handleSubmit(e)}>
                              <label className="block mb-2">Name:</label>
                              <input
                                   ref={inputRef}
                                   type="text"
                                   value={username}
                                   onChange={(e) => handleNameChange(e)}
                                   className="w-full p-2 border rounded-md modal-no-drag focus:ring-blue-500 focus:border-blue-500"
                                   placeholder="Enter your new name"
                              />

                              <div className="mt-4 modal-no-drag">
                                   <button type="submit" className="bg-blue-500 text-white px-4 w-full py-2 rounded-md">
                                        Save Changes
                                   </button>
                              </div>
                         </form>
                         <div>

                              <TooltipProvider>
                                   <Tooltip>

                                        <TooltipContent align='center'>
                                             {/* ToolTipContent For the this button disabled */}
                                             <p className="text-gray-400">Coming Soon</p>

                                        </TooltipContent>

                                        <TooltipTrigger>

                                             <button
                                                  disabled={true}
                                                  onClick={() => setShowTwitterModal(true)}
                                                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-600 disabled:hover:bg-gray-700"
                                             >
                                                  Link Twitter
                                             </button>
                                        </TooltipTrigger>
                                   </Tooltip>
                              </TooltipProvider>



                              <TooltipProvider>
                                   <Tooltip>
                                        <TooltipContent align='center'>
                                             {/* ToolTipContent For the this button disabled */}
                                             <p className="text-gray-400">Coming Soon</p>

                                        </TooltipContent>
                                        <TooltipTrigger>

                                             <button
                                                  disabled={true}
                                                  onClick={() => setShowInstagramModal(true)}
                                                  className="mt-4 ml-4 px-4 py-2 bg-pink-500 text-white rounded-md  hover:bg-pink-600 focus:outline-none focus:ring focus:ring-pink-300 disabled:bg-gray-600 disabled:hover:bg-gray-700"
                                             >
                                                  Link Instagram
                                             </button>
                                        </TooltipTrigger>
                                   </Tooltip>
                              </TooltipProvider>


                         </div>


                         <button
                              type="button"
                              onClick={onClose}
                              className="text-white mt-4 bg-slate-500 p-2 rounded-md w-full hover:bg-slate-600"
                         >
                              Cancel
                         </button>

                         {showTwitterModal && <AccountLinkModal className='modal-no-drag' provider="twitter" onClose={() => setShowTwitterModal(false)} />}
                         {showInstagramModal && <AccountLinkModal className='modal-no-drag' provider="instagram" onClose={() => setShowInstagramModal(false)} />}

                    </div>
               </Draggable>
          </div >
     );
};

export default EditProfileModal;
