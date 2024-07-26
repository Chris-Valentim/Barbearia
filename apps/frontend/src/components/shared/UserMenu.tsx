'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@barba/core'
import Image from 'next/image'
import useUser from '@/data/hooks/useUser'

export interface UserMenuProps {
  user: User
}

const UserMenu = (props: UserMenuProps) => {
  const { getOut } = useUser()

  return props.user ? (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className='flex gap-2 items-center'>
          <div className='flex flex-col items-end'>
            <span className='text-lg font-bold leading-5'>
              {props.user.name}
            </span>
            <span className='text-xs text-zinc-400'>
              {props.user.email}
            </span>
          </div>
          <div className='flex justify-center items-center rounded-full overflow-hidden w-10 h-10 p-1 bg-zinc-700'>
            <Image
              src="/avatar.png"
              alt={props.user.name}
              width={40}
              height={40}
            />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Menu Usuário
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={getOut}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null
}

export default UserMenu
