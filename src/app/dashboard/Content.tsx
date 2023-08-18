"use client"
import UserAvatar from '@/components/UserAvatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropDownMenu';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { FC, useEffect, useState } from 'react'
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Roles, User } from '@prisma/client';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { redirect, useRouter } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Card, Metric, Flex, BarChart, Text, Title } from "@tremor/react";
import type { Color } from "@tremor/react";

interface ContentProps {

}

const Content: FC<ContentProps> = ({ }) => {

  const router = useRouter()
  const queryClient = useQueryClient();

  const [users, setUsers] = useState<User[]>([]);
  const [role, setRole] = useState<Roles>(Roles.USER);

  const { data: session, status } = useSession();

  const { toast } = useToast();


  const { data: userData, isLoading, isError } = useQuery(['userFetch'], async () => {
    const res = await fetch('/api/dashboardFetch');
    const data = await res.json();
    setRole(data.role);
    return data;
  });


  useEffect(() => {
    if (userData) {
      const updatedUsers = userData.users || [];
      setUsers(updatedUsers);
    }
  }, [userData])


  const { mutateAsync: updateUser } = useMutation(async ({ userId, role }: { userId: string, role: Roles }) => {
    try {
      const res = await axios.post('/api/updateUser', { userId, role });
      return res.data;
    } catch (err) {
      console.log(err);
    }

  }, {
    onError: (err) => {


      return toast({
        title: 'Something went wrong while updating user role',
        description: 'Please try again later',
        variant: 'destructive'
      })
    },
    onSuccess: async (data) => {

      await queryClient.invalidateQueries(['userFetch']);

      toast({
        title: 'User role updated',
        description: `User role has been updated successfully for ${data.name}`,
      })

    }
  })


  if (status === 'loading') return (
    <div className='flex justify-center items-center h-screen'>
    </div>
  )

  if (!session) return (
    <div className='flex justify-center items-center h-screen'>
    </div>
  )


  const handleButtonClick = async (e: any) => {

    const key = e.currentTarget.getAttribute('data-key');
    const id = e.currentTarget.getAttribute('data-id');

    if (key === 'user') {
      const foundUser = users.find((user) => user.id === id);

      if (foundUser) {
        if (foundUser.role === Roles.USER) return toast({
          title: `❗ ${foundUser.name} > already has this role`,
        })
        try {
          await updateUser({ userId: foundUser.id, role: Roles.USER });
        } catch (err) {
          console.log(err);
          toast({
            title: 'Something went wrong while updating user role',
            description: 'Please try again later',
            variant: 'destructive'
          })
        }
      }

    } else if (key === 'admin') {
      const foundUser = users.find((user) => user.id === id);



      if (foundUser) {

        if (foundUser.role === Roles.ADMIN) return toast({
          title: `❗ ${foundUser.name} > already has this role`,
        })

        try {
          await updateUser({ userId: foundUser.id, role: Roles.ADMIN });
        } catch (err) {
          console.log(err);
          toast({
            title: 'Something went wrong while updating user role',
            description: 'Please try again later',
            variant: 'destructive'
          })
        }
      }

    }


  }


  const renderUser = (user: User) => {

    return (
      <div className='border-b py-3 flex items-center bg-slate-600 hover:bg-slate-700 rounded w-full p-3 my-2 ' >
        <UserAvatar className='w-12 h-12 my-3 ml-2 text-slate-200 glowing-shadow' user={user} />
        {user.role === Roles.ADMIN ? (<p className='relative ml-6 font-bold text-lg text-red-600'>{user.name}</p>) : (<p className='relative ml-6 font-bold text-lg text-slate-100'>{user.name}</p>)}
        <div className='ml-auto relative'>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={'secondary'} className='font-bold text-lg text-slate-800 hover:bg-slate-800 hover:text-white transition ml-4'>
                Roles
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-transparent border-transparent  rounded-lg py-2 px-4  absolute top-[-80px] left-[60px] shadow-lg shadow-slate-500 ' align='end'>
              <DropdownMenuItem asChild>
                <TooltipProvider>

                  <Tooltip>

                    <TooltipTrigger>

                      <Button
                        onClick={(e) => handleButtonClick(e)}
                        data-key='user'
                        data-id={user.id}
                        disabled={user.role === Roles.USER}
                        className='text-left p-2 w-full hover:bg-slate-500 my-1 rounded-md'>
                        USER
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      {
                        user.role === Roles.USER ? (
                          <p className='text-slate-100'>This button curretly disabled bcs this user already USER.</p>
                        ) : (
                          <p className='text-slate-100'>This button will make this user USER.</p>
                        )
                      }
                    </TooltipContent>

                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <TooltipProvider>

                  <Tooltip>



                    <TooltipTrigger>

                      <Button
                        variant={'destructive'}
                        onClick={(e) => handleButtonClick(e)}
                        data-key='admin'
                        data-id={user.id}
                        disabled={user.role === Roles.ADMIN}
                        className='text-left p-2 w-full hover:bg-slate-500 my-[.35rem] rounded-md'>
                        ADMIN
                      </Button>


                    </TooltipTrigger>

                    <TooltipContent>
                      {
                        user.role === Roles.ADMIN ? (
                          <p className='text-slate-100'>This button curretly disabled bcs this user already admin.</p>
                        ) : (
                          <p className='text-slate-100'>This button will make this user admin.</p>
                        )
                      }
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }


  const chartdata = [
    {
      name: "Users",
      "Number of Users": users.length,

    },
    {
      name: "Admins",
      "Number of Admins": users.filter((user) => user.role === Roles.ADMIN).length,
    },
  ];

  const dataFormatter = (number: number) => {
    // if (number !== Math.floor(number)) {
    //   return ""
    // } else return number
    return number;
  };  

  const barColors: Color[] = ["teal"]

  if (role === Roles.ADMIN) {
    return (
      <div className='flex flex-col items-center'>
        <section className=''>
          <div className='container text-center mb-4'>
            <h1 className='text-4xl font-bold text-slate-800'>Welcome to the Dashboard</h1>
            <p className='text-slate-800'>You are logged in as <span className='font-bold'>{session.user.name}</span></p>
          </div>
        </section>
  
        <section className='flex'>

          <div className='w-2/1 p-4'>
            <div className='container ml-2 w-fit mt-2 shadow rounded-lg p-4 bg-slate-500'>
              <h1 className='text-2xl text-white font-bold mb-4 text-center min-w-[26rem]'>User Roles</h1>
              {users.map((user) => renderUser(user))}
            </div>
          </div>


          <div className='w-3/6 h-1/2 ml-10 p-4 shadow-xl self-center'>
            <Card>
              <Flex className='text-white'>
                <Metric>
                  <Title>Users</Title>
                  <Text>{users.length}</Text>
                </Metric>
                <Metric>
                  <Title>Admins</Title>
                  <Text>{users.filter((user) => user.role === Roles.ADMIN).length}</Text>
                </Metric>
                <Metric>
                  <Title>Users</Title>
                  <Text>{users.filter((user) => user.role === Roles.USER).length}</Text>
                </Metric>
              </Flex>
            </Card>
          </div>
        </section>
  
        <section className='w-full p-4'>
          <Card>
            <BarChart
              className='h-72 antialiased shadow-xl'
              index='name'
              categories={["Number of Users", "Number of Admins"]}
              data={chartdata}
              yAxisWidth={48}
              showLegend={false}
              showTooltip={false}
              allowDecimals={false}
              maxValue={users.length}
              colors={['teal']}
            />
          </Card>
        </section>
      </div>
    );
  } else {
    return (
      <div>
        <h1>You dont have access to this page</h1>
      </div>
    );
  }
  
  



}

export default Content