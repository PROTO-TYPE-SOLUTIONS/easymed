import React, { useEffect } from "react"
import { useRouter } from 'next/router';
import { useDispatch } from "react-redux";
import Link from "next/link";
import { BiArrowBack } from "react-icons/bi";
import { useAuth } from '../hooks/use-auth'
import { getAllPatients } from "@/redux/features/patients";

const NotAuthorized = () => {

  const router = useRouter();
  const auth = useAuth();
  const dispatch = useDispatch();

  useEffect(()=>{
    dispatch(getAllPatients());      
  }, [auth]);

  return (
    <section className="p-12 h-auto flex items-center justify-center h-screen">
      <div className="p-8 space-y-4 rounded md:w-5/12 mx-auto text-center">
        <h1 className="text-7xl font-bold">403</h1>
        <p className="font-semibold">Restricted Access</p>
        <p>You lack permission to access this page</p>
        <Link href={`${auth?.role === "patient" ? "/patient-overview" : "/dashboard"}`}>
          <div className="flex items-center justify-center">
            <button className="rounded text-white text-sm bg-primary px-4 py-2 my-2 flex items-center gap-4">
              <BiArrowBack />
              {`${auth?.role === "patient" ? "Back to Patient Overview" : "Back to Dashboard"}`}
            </button>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default NotAuthorized;
