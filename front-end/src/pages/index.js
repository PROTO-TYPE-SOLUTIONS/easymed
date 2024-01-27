import React, { useEffect } from "react"
import { useRouter } from 'next/router';

import { useAuth } from "@/assets/hooks/use-auth";
import LandingPage from "@/components/landing-page";

export default function Home() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(()=>{
    if(auth){
      router.push('/dashboard');      
    }        
  }, []);

  return (
    <>
      <LandingPage />
    </>
  );
}
