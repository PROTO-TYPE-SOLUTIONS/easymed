import { useContext } from 'react';
import { authContext } from '@/components/use-context';


export const useAuth = () => {
    const { user } = useContext(authContext);
    console.log("AUTH_USER ",user)
    return user;
};
