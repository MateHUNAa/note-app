"use client"
import { useEffect, useState } from 'react'
import TextInput from '@/components/Home/TextInput'
import Image from 'next/image'
import axios from 'axios'
import NotesTable from '@/components/Home/NotesTable'
import { useToast } from '@/components/ui/use-toast'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Roles } from '@prisma/client'

export default function Home() {


  const queryClient = new QueryClient()
  const [search, setSearch] = useState<string>('');
  const [userRole, setRole] = useState<Roles>(Roles.USER);
  const [notesUpdated, setNotesUpdated] = useState<boolean>(false);
  const { toast } = useToast()

  const handleSearch = (value: string) => {
    setSearch(value);
  }


  const handelAlert = async () => {
    if (search) {
      try {
        const response = await axios.post('/api/insertNote', { content: search });
        toast({
          title: 'Success',
          description: 'Note added successfully',
        })
        setSearch('');
        setNotesUpdated(!notesUpdated);
      } catch (error) {
        console.error('An error occurred:', error);
        return;
      }
    } else {
      toast({
        title: 'Error',
        description: 'Please enter a note',
        variant: 'destructive',
      })
    }
  };


  const removeAll = async (admin: boolean) => {
    const confirmRemove = confirm('Are you sure you want to remove all notes?');
    if (confirmRemove) {

      try {
        const response = await axios.post('/api/removeAll', { global: admin});
        setNotesUpdated(!notesUpdated);
        toast({
          title: 'Success',
          description: 'All notes removed successfully',
        })
        console.log(response);
      } catch (error) {
        console.error('An error occurred:', error);
        return;
      }
    }
  }

  const getRole = async () => {
    try {
      const response = await axios.get('/api/getUserRole');
      console.log(response)
      setRole(response.data.role);

    } catch (e) {
      console.error('TE GECI')
      console.log(e);

      setRole(Roles.USER)
    }
  }

  useEffect(() => {
    getRole();
  }, []);



  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <div className='flex flex-col items-center justify-center h-screen'>
          <NotesTable role={userRole} fetchNew={() => {
            setNotesUpdated(!notesUpdated);
          }} />
          <TextInput placeholder='Type Something here' role={userRole} value={search} onChange={handleSearch} handleAlert={handelAlert} removeAll={(e) => removeAll(e)} />
        </div>
      </SessionProvider>
    </QueryClientProvider>
  )
}
