import { API_URL, API_METHODS } from "@/assets/api-endpoints";
import { backendAxiosInstance } from "@/assets/backend-axios-instance";
import path from 'path';
import fs from 'fs/promises';

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
            if (!req.headers?.authorization) {
                res.status(401).send('Unauthorized');
            }

            const config = {
                headers: {
                    'Authorization': req.headers.authorization,
                },
                responseType: 'arraybuffer',
            };

            const body = req.query;

            const response = await backendAxiosInstance.get(`${API_URL.DOWNLOAD_RESULT_PDF}${body.item_name}/${body.item_id}`, config);

            // Save the PDF file to the public directory
            const filePath = path.join(process.cwd(), 'public', `download.pdf`);
            console.log("PATH",filePath)
            await fs.writeFile(filePath, response.data, 'binary');
            

            // Send the link to the PDF file as a response to the client
            const publicURL = `/download.pdf`;
            res.status(200).json({ link: publicURL });

        } catch (e) {
            res.status(500).json(e.message);
        }
    } else {
        res.status(404).json({ message: 'path not found!' });
    }
}
