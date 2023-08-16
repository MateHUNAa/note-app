"use client"
import { FC, useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { signIn } from "next-auth/react"
import { Icons } from './icons'
import { useToast } from '@/components/ui/use-toast'


const UserAuthForm: FC = () => {

     const { toast } = useToast()
     const [isLoading, setIsLoading] = useState<boolean>(false)
   
     const loginWithGoogle = async () => {
       setIsLoading(true)
   
       try {
         await signIn('google')
       } catch (error) {
         toast({
           title: 'Error',
           description: 'There was an error logging in with Google',
           variant: 'destructive',
         })
       } finally {
         setIsLoading(false)
       }
     }
     return (
          <div className={cn('flex justify-center')}>
            <Button
              isLoading={isLoading}
              type='button'
              size='sm'
              className='w-full'
              onClick={loginWithGoogle}
              disabled={isLoading}>
              {isLoading ? null : <Icons.google className='h-4 w-4 mr-2' />}
              Google
            </Button>
          </div>
        )
}

export default UserAuthForm