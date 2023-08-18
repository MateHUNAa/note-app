// NotesTable.tsx

import React, { FC, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import UserAvatar from '../UserAvatar';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import { ProgressBar } from '../ProgressBar';
import { Roles } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../ui/use-toast';
import { formatDateString } from '@/lib/utils/formatDateString';
import { cn } from '@/lib/utils';
import { on } from 'events';

interface Creator {
  id: string;
  name: string;
  email: string;
  image: string;
  notes: Note[];
}

interface Note {
  id: number;
  content: string;
  createdAt: string;
  creatorId?: string;
}

interface NotesTableProps {
  role: Roles
}

const NotesTable: FC<NotesTableProps> = ({ role }) => {

  const searchInputRef = useRef<HTMLInputElement>(null);

  const { data: session, status } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [newlyAddedNotes, setNewlyAddedNotes] = useState<number[]>([]);
  const [search, setSearch] = useState<string>('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: creatorsData, isLoading: creatorsLoading, isError: creatorsError } = useQuery<Creator[]>(['creators'], async () => {
    const { data } = await axios.get('/api/getCreators');
    return data;
  });

  const { data: notesData, isLoading: notesLoading, isError: notesError } = useQuery<Note[]>(['notes'], async () => {
    const { data } = await axios.get('/api/getNotes');
    return data;
  });

  useEffect(() => {
    if (creatorsData) {
      setCreators(creatorsData);
    }
  }, [creatorsData]);


  useEffect(() => {
    if (notesData) {
      setNotes(notesData);
    }
  }, [notesData]);

  const { mutate: deleteNote } = useMutation((id: number) => axios.post(`/api/deleteNote`, { id: id }), {
    onSuccess: async () => {
      const newNotes = await axios.get('/api/getNotes');
      setNotes(newNotes.data);
      queryClient.invalidateQueries(['notes']);
      toast({
        title: 'Note deleted',
        description: 'Note deleted successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Something went wrong',
        description: 'Unable to delete note',
        variant: 'destructive',
      });
    }
  });

  const { mutate: insertNote } = useMutation(
    async ({ content, creatorId }: { content: string; creatorId: string }) => {
      const response = await axios.post(`/api/insertNote`, { content, creatorId });
      const newNoteId = response.data.id;
      return newNoteId;
    },
    {
      onSuccess: async (newNotesData) => {
        const newNotes = await axios.get('/api/getNotes');
        setNotes(newNotes.data);
        queryClient.invalidateQueries(['notes']);
        // setNewlyAddedNotes((prev) => [...prev, newNoteId]);
        setSearch('');
        toast({
          title: 'Note added',
          description: 'Note added successfully',
        });
      },
      onError: () => {
        toast({
          title: 'Something went wrong',
          description: 'Unable to add note',
          variant: 'destructive',
        });
      },
    }
  );

  const { mutate: deleteAll } = useMutation(
    async ({ global, role }: { global: boolean, role?: Roles }) => {
      const response = await axios.post(`/api/removeAll`, { global, role });
      return response;
    },
    {

      onError: (err) => {
        console.log(err);
        toast({
          title: 'Something went wrong',
          description: 'Unable to delete all notes',
          variant: 'destructive',
        });
      },

      onSuccess: async () => {
        const newNotes = await axios.get('/api/getNotes');
        setNotes(newNotes.data);
        queryClient.invalidateQueries(['notes']);
        toast({
          title: 'Success',
          description: 'All notes removed successfully',
        })

      }
    });


  if (notesLoading || creatorsLoading) return <ProgressBar />;
  if (notesError || creatorsError) return <div>Something went wrong</div>;
  if (status === 'loading') return <ProgressBar />;

  const onChange = async (value: string) => {
    if (value) {
      setSearch(value);
    }
  };

  const renderNotes = () => {
    if (!session) {
      return (
        <tr>
          <td colSpan={4} className="px-4 py-3 text-center text-black">
            Please sign in to view notes.
          </td>
        </tr>
      );
    }

    if (notes.length !== 0) {
      return notes.map((note: Note) => {
        const creator = creators.find((c: Creator) => note.creatorId === c.id);

        const isNoteNew = newlyAddedNotes.includes(note.id);

        const user = session.user as User;
        let admin = role === Roles.ADMIN;

        return (
          <tr key={note.id} className={cn('p-3 slide-in-bounce', isNoteNew ? 'slide-in-bounce' : '')}>
            <td className="ml-3">
              {creator ? <UserAvatar className=" ml-5" user={creator} /> : "Navbar"}
            </td>
            <td className="px-4 py-3 text-black font-semibold tracking-wider">
              {note.content}
            </td>
            <td className="px-4 py-3 text-black font-semibold tracking-widest">
              {formatDateString(note.createdAt)}
            </td>
            {user.id === note.creatorId || admin ? (
              <td className="px-4 py-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipContent className="bg-slate-800 rounded-md p-1 font-bold text-white">
                      <p>Remove Item</p>
                    </TooltipContent>
                    <TooltipTrigger>
                      <span className="rounded-full p-2 shadow shadow-slate-600 hover:shadow-slate-700 transition-all">
                        {session.user.id !== note.creatorId ? (
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="cursor-pointer text-red-500 hover:text-red-950 transition"
                            size="lg"
                            onClick={async () => {
                              try {
                                deleteNote(note.id);
                              } catch (error) {
                                console.error('An error occurred:', error);
                              }
                            }}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            className="cursor-pointer text-red-400 hover:text-red-600 transition"
                            size="lg"
                            onClick={async () => {
                              try {
                                deleteNote(note.id);
                              } catch (error) {
                                console.error('An error occurred:', error);
                              }
                            }}
                          />
                        )}
                      </span>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              </td>
            ) : (
              <td />
            )}
          </tr>
        );
      });
    } else {

    }
  };

  return (
    <div className="mb-5 shadow-xl rounded-lg overflow-hidden bg-slate-500 w-[700px] py-3">
      <table className="min-w-full  border-t-slate-700 border-t-[15px]">
        <caption className="text-white text-xl font-medium pb-4 pt-4 caption-top">
          Notes
        </caption>
        <thead className="bg-slate-400">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Content</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Created At</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700 ">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-slate-500 divide-y divide-slate-400">
          {session?.user ? (
            renderNotes()
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-4 text-center text-black">
                Please sign in to view notes.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-start  border-t-4 border-black my-4 items-center">
        <div className='mt-5 mx-auto'>


          <TooltipProvider>
            <Tooltip>
              <TooltipContent align='center' className="bg-slate-800 rounded-md p-1 font-bold text-white mb-4 ml-3">
                <p>Remove All Your Notes</p>
              </TooltipContent>
              <TooltipTrigger>
                <button
                  onClick={async () => {
                    const confirmRemove = confirm('Are you sure you want to remove all notes?');
                    if (confirmRemove) {

                      try {
                        await deleteAll({ global: false, role: role });
                      } catch (error) {
                        console.error('An error occurred:', error);
                        return;
                      }
                    }
                  }}
                  className='bg-red-400 hover:bg-red-700 transition text-white font-medium px-4 py-2 rounded-lg ml-4 w-24 tracking-widest focus:ring-2 focus:ring-red-800'>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    className="cursor-pointer  transition"
                    size="lg"
                  />
                </button>
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>



          <input
            ref={searchInputRef}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onChange(e.target.value);
              e.preventDefault();

              if (search.length > 25) {
                toast({
                  title: 'Error',
                  description: 'Note must be less than 25 characters',
                  variant: 'destructive',
                })

              }
            }}
            placeholder='Add a note'
            className='border w-64 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mx-2 p-1'
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipContent align='center' className="bg-slate-800 rounded-md p-1 font-bold text-white mb-4 ml-3">

                <p>Add Note</p>

              </TooltipContent>
              <TooltipTrigger>

                <button
                  key="add-note-button"
                  onClick={async (e) => {

                    try {
                      if (search && session?.user) {
                        await insertNote({
                          content: search,
                          creatorId: session?.user.id,
                        });

                        if (searchInputRef.current) {
                          searchInputRef.current.value = '';
                        }

                      }
                    } catch (error) {
                      console.error('An error occurred while sending the data:', { error, e });
                    }

                  }}
                  className='bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-4 py-2 rounded-lg ml-4 w-24 tracking-widest focus:ring-2 focus:ring-blue-800'>
                  Add
                </button>

              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );


};

export default NotesTable;
