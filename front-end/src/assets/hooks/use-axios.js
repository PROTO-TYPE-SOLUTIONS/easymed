import axios from 'axios';

const useAxios = (useAuth) => {
    const user  = useAuth;

    const axiosInstance = axios.create({
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    });

    return axiosInstance;
};

export default useAxios;
