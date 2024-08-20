import { API_URL,API_METHODS } from "@/assets/api-endpoints";
import { backendAxiosInstance } from "@/assets/backend-axios-instance";

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1024mb' // Set desired value here
        }
    }
}
export default async function handler(req, res) {
    if (req.method === API_METHODS.GET) {
        try {
            // if (!req.headers?.authorization){
            //     res.status(401).send('Unauthorized');
            // }
            const config = {
                headers: {
                    'Authorization': req.headers.authorization,
                }
            };


            await backendAxiosInstance.get(`${API_URL.BILLING_INVOICE_ITEMS}`, config).then(response => {
                res.status(200).json(response.data);

            }).catch(e => {
                    res.status(e.response?.status ?? 500).json(e.response?.data)
                }
            )

        } catch (e) {
            res.status(500).json(e.message);
        }
    }
    else if (req.method === API_METHODS.POST) {
        try {
            if (!req.headers?.authorization){
                res.status(401).send('Unauthorized');
            }
            const config = {
                headers: {
                    'Authorization': req.headers.authorization,
                }
            };
            
            const body = req.body;

            
            await backendAxiosInstance.post(`${API_URL.BILLING_INVOICE_ITEMS}`,body, config)
                .then(response => {
                    res.status(200).json(response.data);
                })
                .catch(e => {
                        res.status(e.response?.status ?? 500).json(e.response?.data)
                    }
                )

        } catch (e) {
            res.status(500).json(e.message);
        }
    }
    else if (req.method === API_METHODS.PATCH) {
        try {
            // if (!req.headers?.authorization){
            //     res.status(401).send('Unauthorized');
            // }
            const config = {
                headers: {
                    'Authorization': req.headers.authorization,
                }
            };
            const body = req.body;
            const query = req.query;

            await backendAxiosInstance.patch(`${API_URL.BILLING_INVOICE_ITEMS}${query.invoice_item}/`,body, config).then(response => {
                res.status(200).json(response.data);

            }).catch(e => {
                    res.status(e.response?.status ?? 500).json(e.response?.data)

                }
            )

        } catch (e) {
            res.status(500).json(e.message);
        }
    }
    else {
        res.status(404).json({message: 'path not found!'});
    }
}