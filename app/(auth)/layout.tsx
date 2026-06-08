import Navbar from '@/components/ui/navbar';
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'

const AuthLayout = async ({ children }: {children: ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  
    if(isUserAuthenticated) redirect('/dashboard');
  return (
    <div className='auth-layout'>
      <Navbar />
      {children}</div>
  )
}

export default AuthLayout;