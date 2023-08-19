"use client"
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { User } from 'next-auth'
import { FC } from 'react'
import UserAvatar from '../components/UserAvatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../components/ui/DropDownMenu'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Roles } from '@prisma/client'
import { cn } from '@/lib/utils'

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "email" | "id" | "image" | "name">
  username: string
  role: Roles
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user, role, className, username, ...props }) => {

  const ifAdmin = () => {
    if (role === Roles.ADMIN) {
      return (
        <div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='mt-3' asChild>
            <Link className='text-red-500 font-bold' href='/dashboard'>Dashboard <p className='text-red-500 float-right right-0 ml-10 uppercase font-bold tracking-wide '>[Admin]</p></Link>
          </DropdownMenuItem>
        </div>
      )
    }
  }

  return (
    <div className={cn(className)} {...props} >
      <DropdownMenu>
        <DropdownMenuTrigger>
          <UserAvatar className='h-10 w-10'
            user={{
              name: user.name || null,
              image: user.image || null,

            }}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="text-black font-bold bg-slate-600 border-black" align='end'>
          <div className='flex items-center justify-start gap-2 p-2'>
            <div className='flex flex-col space-y-1 leading-none'>
              {username && <p className='font-bold'>{username}</p>}
              {user.email && <p className='w-[200px] truncate text-sm text-zinc-700'>{user.email}</p>}
            </div>
          </div>

          <DropdownMenuSeparator />
          <div className='font-semibold'>
            <DropdownMenuItem asChild>
              <Link href='/' >Home</Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href={`/profile/${user.id}`} >Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href='/settings' >Settings</Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className='border-black'/>

            <DropdownMenuItem onSelect={(event) => {
              event.preventDefault()
              signOut({
                callbackUrl: `${window.location.origin}/sing-in`
              })
            }}
              className='cursor-pointer'>
              Sign Out
            </DropdownMenuItem>
          </div>
          {ifAdmin()}

        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserAccountNav