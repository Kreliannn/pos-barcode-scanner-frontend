"use client"
import Link from "next/link";
import { SideBarAdmin } from "@/components/ui/sidebarAdmin";
import UnauthorizedPage from "@/components/ui/unauthorizedPage";
import useUserStore from "@/app/store/useUserStore";
import { SidebarProvider } from "@/components/ui/sidebar";


export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    
    const {user} = useUserStore()

    if(!user || user?.role != "admin") return <UnauthorizedPage />

    return (
      <div className="flex min-h-screen ">
          <SidebarProvider>
                
                <SideBarAdmin />
               
                <main className="w-full">
                    <div className="mb-[80px] md:mb-[0px]"> </div>
                    {children}
                </main>
          </SidebarProvider>
       
      </div>
    );
  }