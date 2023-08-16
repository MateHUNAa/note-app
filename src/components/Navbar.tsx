
import Link from "next/link"
import { Icons } from "./icons"
import { buttonVariants } from "./ui/button"
import { getAuthSession } from "@/lib/auth" 
import UserAccountNav from "./UserAccountNav"


const Navbar = async () => {

     const session = await getAuthSession()

     return <div className="fixed top-0 inset-x-0 h-fit bg-slate-800 border-b border-slate-700 z-[10] py-2">
          <div className="container max-w-7xl h-full mx-auto flex item-center justify-between gap-2">
               {/* Logo */}
               <Link href='/' className="flex gap-2 items-center">
                    <Icons.logo className="w-8 h-8 sm:h-6 sm:w-6 scale-[2.6]" />
                    <p className="hidden text-white text-sm font-medium md:block">Simple Noter</p>
               </Link>

               {/* Search Bar */}

               {/* Auth */}

               {session ?.user ? (


               <UserAccountNav user={session.user}/>

               ) : (
                    <Link href='/sign-in' className={buttonVariants()}>Sign In</Link>
               )}
          </div>
     </div>
}

export default Navbar