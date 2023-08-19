import { FC } from 'react'
import { signIn } from 'next-auth/react'
import { cn } from '@/lib/utils';

interface AccountLinkModalProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose: () => void;
  provider: string;
}

const AccountLinkModal: FC<AccountLinkModalProps> = ({ onClose, provider, className, ...props }) => {
  const handleLogin = () => {
    signIn(provider); // Replace with your actual callback URL
  };

  return (
    <div {...props} className={cn("fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75", className)}>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Link Your {provider === 'twitter' ? 'Twitter' : 'Instagram'} Account</h2>
        <p className="mb-4">
          To link your {provider === 'twitter' ? 'Twitter' : 'Instagram'} account, please log in with your {provider === 'twitter' ? 'Twitter' : 'Instagram'} account.
        </p>
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none"
        >
          Login with {provider === 'twitter' ? 'Twitter' : 'Instagram'}
        </button>
        <button
          onClick={onClose}
          className="ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AccountLinkModal