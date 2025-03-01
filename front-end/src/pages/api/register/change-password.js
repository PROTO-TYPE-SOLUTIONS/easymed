export default async function handler(req, res) {
    if (req.method === API_METHODS.POST) {
        try {
            const { uidb64, token, new_password, confirm_password } = req.body;

            if (!uidb64 || !token) {
                return res.status(400).json({ message: "Invalid request: Missing UID or token" });
            }

            const response = await backendAxiosInstance.post(
                `${API_URL.CHANGE_PASSWORD}/${uidb64}/${token}/`, 
                { new_password, confirm_password }
            );

            res.status(200).json(response.data);
        } catch (error) {
            console.error("Reset Password Error:", error.response?.data || error.message);
            res.status(error.response?.status ?? 500).json({
                message: error.response?.data?.message || "Failed to reset password"
            });
        }
    } else {
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
