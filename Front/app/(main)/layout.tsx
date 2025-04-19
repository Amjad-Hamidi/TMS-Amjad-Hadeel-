// "use client";

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/context/AuthContext';
// import Menu from '@/components/Menu';
// import ProtectedRoute from '@/components/ProtectedRoute';

// const Layout =({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>)=> {
//   const router = useRouter();
//   const { state } = useAuth();

//   useEffect(() => {
//      if (!state.user) {
//         router.push('/user/signin');
//       }
//   }, [router]); 

//   return (
//   <div className='flex '>
//    <div className=" left-0  w-64  p-4 z-50 sidebar-menu transition-transform sticky h-screen top-10   ">
//    <a href="#" className="flex items-center pb-4 border-b border-b-gray-800">
//       <h2 className="font-bold text-2xl ">
//         {state.user?.username}{""}
//         <span className="bg-[#f84525] text-white px-2 rounded-md">{state.user?.role.substring(0,3)}</span>
//       </h2>
//     </a>
//    <Menu/>
//   </div>
//   {/* end sidenav */}
//   <ProtectedRoute>
//   {children}

//   </ProtectedRoute>

// </div>

 
//   );
// };

// export default Layout;

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import ProtectedRoute from "@/components/ProtectedRoute"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ProtectedRoute>
    <div className="flex min-h-screen ">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 transition-all duration-300 ease-in-out">
        <div className="p-4 sm:p-6 md:p-8">{children}</div>
      </main>
    </div>
    </ProtectedRoute>
  )
}

export default DashboardLayout
