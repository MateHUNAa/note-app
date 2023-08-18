"use client"
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { User } from 'next-auth'
import { FC } from 'react'
import UserAvatar from './UserAvatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './ui/DropDownMenu'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { Roles } from '@prisma/client'

interface UserAccountNavProps {
  user: Pick<User, 'name' | 'image' | 'email'>
  role: Roles
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user, role }) => {

  const ifAdmin = () => {
    if (role === Roles.ADMIN) {
      return (
        <div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className='mt-3' asChild>
            <Link className='text-red-500 font-bold' href='/dashboard'>Dashboard <p className='text-red-500 float-right right-0 ml-24 uppercase font-bold tracking-wide '>Admin</p></Link>
          </DropdownMenuItem>
        </div>
      )
    }
  }

  return <DropdownMenu>
    <DropdownMenuTrigger>
      <UserAvatar className='h-10 w-10'
        user={{
          name: user.name || null,
          image: user.image || null,

        }}
      />
    </DropdownMenuTrigger>

    <DropdownMenuContent className="bg-white" align='end'>
      <div className='flex items-center justify-start gap-2 p-2'>
        <div className='flex flex-col space-y-1 leading-none'>
          {user.name && <p className='font-bold'>{user.name}</p>}
          {user.email && <p className='w-[200px] truncate text-sm text-zinc-700'>{user.email}</p>}
        </div>
      </div>

      <DropdownMenuSeparator />
      <div className='font-semibold'>
      <DropdownMenuItem asChild>
        <Link href='/' >Home</Link>
      </DropdownMenuItem>

      <DropdownMenuItem asChild>
        <Link href='/profile' >Profile</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href='/settings' >Settings</Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

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
}

export default UserAccountNav