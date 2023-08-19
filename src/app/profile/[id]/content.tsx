// profile/[id]/content.tsx
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FC, useState } from 'react'
import axios from 'axios';
import UserAvatar from '@/components/UserAvatar';
import EditProfileModal from '@/components/profile/EditProfileModal';
import { useToast } from '@/components/ui/use-toast';
import { Roles } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface ContentProps {
  id: string
}

const Content: FC<ContentProps> = (props) => {

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    queryClient.invalidateQueries(['fetchUser']);
    router.refresh();
  };


  const { id } = props;

  const { data: user } = useQuery({
    queryKey: ['fetchUser', id],
    queryFn: async () => {
      const response = await axios.patch('/api/getUserById', { id: id })
      return response.data
    }
  })


  if (!user) {
    return (
      <div>
        User Not Found
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-slate-700 scale-110">
      <div className="max-w-md p-6 bg-gray-800 shadow-lg rounded-lg">
        <div className="mb-6 text-center">
          <UserAvatar user={user} className="w-24 h-24 mx-auto" />
          <h2 className="mt-2 text-2xl font-semibold text-white">{user.username}</h2>
          <p className="text-gray-400">{user.id === "cllibvfxn0000v2k48ugiy8jn" && user.role === Roles.ADMIN ? "Web Developer" : user.role}</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={openEditModal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Edit Profile
          </button>
        </div>
        <div className="mt-6 text-center text-gray-400">
          <p>Follow me on social media:</p>
          <div className="flex justify-center mt-2">
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700 mr-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
      
      <EditProfileModal isOpen={isEditModalOpen} onClose={closeEditModal} />
    </div>
  );

}

export default Content;
