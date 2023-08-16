// NotesTable.tsx

import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Avatar } from '@radix-ui/react-avatar';
import UserAvatar from './UserAvatar';
import { useSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/db';
import { User } from 'next-auth';
import { ProgressBar } from './ProgressBar';

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
  fetchNew?: () => void;
}

const NotesTable: FC<NotesTableProps> = ({ fetchNew }) => {
  const [notes, setNotes] = useState([]);
  const [creators, setCreators] = useState([]);
  const { data: session, status } = useSession();




  const fetchData = async () => {

    try {
      const response = await axios.get('/api/getNotes');
      const data = response.data;
      setNotes(data.notes);
      setCreators(data.creators);
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  useEffect(() => {

    fetchData();
  }, [fetchNew]);



  const formatDateString = (dateString: string) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    };

    const formattedDate = new Date(dateString).toLocaleString('hu-HU')
    return formattedDate;
  };

  if (status === 'loading') {
    return (
      <ProgressBar />
    )
  }





  const renderNotes = () => {
    if (session && notes) {
      return notes.map((note: Note) => {
        const creator = creators.find((c: Creator) => note.creatorId === c.id);

        const me = session.user as User;

        return (
          <tr key={note.id} className="border-b border-gray-300">

            <td className='ml-3 '>
              {creator ? (<UserAvatar className='border-3 border-slate-600 ml-5' user={creator} />) : ('No creator information')}
            </td>

            <td className="px-4 py-3 text-gray-700">{note.content}</td>
            <td className="px-4 py-3 text-gray-700">{formatDateString(note.createdAt)}</td>


            {me.id === note.creatorId ? (
              <td className="px-4 py-3"> {/*TrashBin*/}
                <TooltipProvider>



                  <Tooltip >
                    <TooltipContent className='bg-slate-800 rounded-md p-1 font-bold text-white'>
                      <p>Remove Item</p>
                    </TooltipContent>
                    <TooltipTrigger>
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        className='cursor-pointer text-red-400 hover:text-red-600 transition'
                        size="lg"
                        onClick={async () => {
                          try {
                            await axios.post(`/api/deleteNote`, { id: note.id });
                            fetchData();
                          } catch (error) {
                            console.error('An error occurred:', error);
                          }
                        }} /></TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              </td>
            ) : <td />
            }

          </tr>
        );
      });
    } else {
      return null; // No notes or user not signed in
    }
  };

  return (
    <div className='mb-5 shadow-xl rounded-lg overflow-hidden bg-gray-100 w-[700px]'>
      <table className="min-w-full divide-y divide-gray-200 border-t-slate-700 border-t-[9.88px] ">
        <caption className="text-gray-500 text-xl font-medium pb-4 pt-4 caption-top">
          Notes
        </caption>
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">ID</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Content</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">Created At</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-gray-300 divide-y divide-gray-400 ">
          {session?.user ? (

            renderNotes()
          ) : (
            <tr>
              <td colSpan={4} className="px-4 py-3 text-center text-gray-700">
                Please sign in to view notes.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );




};

export default NotesTable;
