
import Link from "next/link"
import { Icons } from "@/components/Icons"
import { buttonVariants } from "@/components/ui/button"
import { getAuthSession } from "@/lib/auth"
import UserAccountNav from "@/layout/UserAccountNav"
import { getRoleAsync } from "@/lib/utils/accessControl"



const Navbar = async () => {
     const session = await getAuthSession();

     return (
          <div className="fixed top-0 h-fit bg-slate-800 border-b border-slate-700 z-[10] py-2 w-full">
              <div className="h-12 w-full flex items-center justify-between">
                  {/* Logo */}
                  <Link href='/' className="flex gap-2 items-center justify-start ml-4">
                      <Icons.logo style={{ width: '90px', height: '90px' }} />
                      <p className="hidden text-white text-sm font-medium md:block">Simple Noter</p>
                  </Link>
      
                  <div className="flex items-center gap-2 right-0 p-4">
                      {session?.user ? (
                          <UserAccountNav user={session.user} role={await getRoleAsync(session.user)}  style={{ marginRight: '50px'}} />
                      ) : (
                          <Link href='/sign-in' className={buttonVariants()}>Sign In</Link>
                      )}
                  </div>
              </div>
          </div>
      );
      
      

      
};


export default Navbar