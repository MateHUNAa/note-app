"use client"
import { useState } from 'react'
import TextInput from '@/components/TextInput'
import Image from 'next/image'
import axios from 'axios'
import NotesTable from '@/components/NotesTable'
import { useToast } from '@/components/ui/use-toast'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function Home() {

  
  const queryClient = new QueryClient()
  const [search, setSearch] = useState<string>('');
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


  const removeAll = async () => {
    const confirmRemove = confirm('Are you sure you want to remove all notes?');
    if (confirmRemove) {

      try {
        const response = await axios.post('/api/removeAll');
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
  
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <div className='flex flex-col items-center justify-center h-screen'>
          <NotesTable fetchNew={() => {
            setNotesUpdated(!notesUpdated);
          }} />
          <TextInput placeholder='Type Something here' value={search} onChange={handleSearch} handleAlert={handelAlert} removeAll={removeAll} />
        </div>
      </SessionProvider>
    </QueryClientProvider>
  )
}
