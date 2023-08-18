"use client"
import { useEffect, useState } from 'react'
import TextInput from '@/components/Home/__test__/TextInput.test'
import Image from 'next/image'
import axios from 'axios'
import NotesTable from '@/components/Home/NotesTable'
import { useToast } from '@/components/ui/use-toast'
import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Roles } from '@prisma/client'

export default function Home() {


  const queryClient = new QueryClient()

  const [userRole, setRole] = useState<Roles>(Roles.USER);
  const { toast } = useToast()

  
  const getRole = async () => {
    try {
      const response = await axios.get('/api/getUserRole');
      setRole(response.data.role);
    } catch (e) {
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
          <NotesTable role={userRole} />
        </div>
      </SessionProvider>
    </QueryClientProvider>
  )
}
