"use client"
import { User } from '@prisma/client'
import * as React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { UsernameValidator } from '@/lib/validators/username'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
     user: Pick<User, 'id' | 'name'>
}


export function UserNameForm({ user, className, ...props }: UserNameFormProps) {



     return (


          <form className={cn(className)} {...props} >
               <Card>
                    <CardHeader>
                         <CardTitle>Your username</CardTitle>
                         <CardDescription>
                              Please enter a display name you are comfortable with.
                         </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className='relative grid gap-1'>
                              <div className='absolute top-0 left-0 w-8 h-10 grid place-items-center'>
                                   <span className='text-sm text-zinc-400'>u/</span>
                              </div>
                              <Label className='sr-only' htmlFor='name'>
                                   Name
                              </Label>
                              <Input
                                   id='name'
                                   className='w-[400px] pl-6'
                                   size={32}
                              />
                           
                         </div>
                    </CardContent>
                    <CardFooter>
                         <Button>Change name</Button>
                    </CardFooter>
               </Card>
          </form>

     )
}