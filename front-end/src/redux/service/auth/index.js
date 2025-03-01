import axios from "axios";
import { APP_API_URL } from "@/assets/api-endpoints";
import UseAxios from "@/assets/hooks/use-axios";
import { useRouter } from "next/router";


export const registerUser = (payload) => {
    return new Promise((resolve, reject) => {
        axios.post(`${APP_API_URL.REGISTER_USER}`, payload)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.message)
            })
    })
}

export const createUser = (payload, auth) => {
    const axiosInstance = UseAxios(auth);
    return new Promise((resolve, reject) => {
        axiosInstance.post(`${APP_API_URL.CREATE_USER}`, payload, auth)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.message)
            })
    })
}

export const fetchUserPermissions = (user_id) => {
    return new Promise((resolve, reject) => {
        axios.get(`${APP_API_URL.GET_USER_PERMISSIONS}`, {
            params: {
                user_id: user_id
            }
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.message)
            })
    })
}

export const fetchGroupPermissions = (group_id, auth) => {
    const axiosInstance = UseAxios(auth);
    return new Promise((resolve, reject) => {
        axiosInstance.get(`${APP_API_URL.FETCH_GROUP_PERMISSIONS}`, {
            params: {
                group_id: group_id
            }
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.message)
            })
    })
}

export const fetchGroups = (auth) => {
    const axiosInstance = UseAxios(auth);
    return new Promise((resolve, reject) => {
        axiosInstance.get(`${APP_API_URL.FETCH_GROUP}`, auth)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.message)
            })
    })
}

export const fetchAllThePermissions = (auth) => {
    const axiosInstance = UseAxios(auth);
    return new Promise((resolve, reject) => {
        axiosInstance.get(`${APP_API_URL.FETCH_ALL_PERMISSIONS}`, auth)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.message)
            })
    })
}

export const fetchPatientGroup = (name) => {
    const axiosInstance = UseAxios();
    return new Promise((resolve, reject) => {
        axios.get(`${APP_API_URL.FETCH_PATIENT_GROUP}`, {
            params: {
                name: name
            }
        })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.message)
            })
    })
}

export const fetchDepartments = (auth) => {
    const axiosInstance = UseAxios(auth);
    return new Promise((resolve, reject) => {
        axiosInstance.get(`${APP_API_URL.FETCH_DEPARTMENTS}`)
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.message)
            })
    })
}
export const resetPassword = async (email) => {
    console.log("Payload:", payload);
    try {
        const response = await axios.post(`${APP_API_URL.PASSWORD_RESET}`, { email });
    } catch (error) {
        throw new Error(error.response?.data?.message || "Failed to reset password");
    }
};

export const updatePassword = async (payload) => {
    try {
        if (!payload.uidb64 || !payload.token) {
            throw new Error("Missing UID or token");
        }

        console.log("Making request to:", `${APP_API_URL.CHANGE_PASSWORD}/${payload.uidb64}/${payload.token}/`);
        console.log("Payload:", payload);

        const response = await axios.post(
            `${APP_API_URL.CHANGE_PASSWORD}/${payload.uidb64}/${payload.token}/`,
            {
                new_password: payload.new_password,
                confirm_password: payload.confirm_password
            }
        );

        console.log("Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error response:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to update password");
    }
};



// export const updatePassword = async (payload) => {
//     try {
//         const response = await fetch('/api/register/change-password', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 new_password: payload.new_password,
//                 confirm_password: payload.confirm_password,
//                 uidb64: payload.uidb64,
//                 token: payload.token,
//             }),
//         });

//         if (!response.ok) {
//             throw new Error('Failed to update password');
//         }

//         return await response.json();
//     } catch (error) {
//         throw new Error(error.message);
//     }
// };


