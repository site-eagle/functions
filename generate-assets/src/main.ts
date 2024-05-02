import { Client, Storage } from "node-appwrite";

type Context = {
	req: any;
	res: any;
	log: (msg: any) => void;
	error: (msg: any) => void;
};

const APPWRITE_PROJECT_ID = process.env.APPWRITE_FUNCTION_PROJECT_ID;
const APPWRITE_BUCKET_ID = process.env.APPWRITE_BUCKET_ID;
const APPWRITE_API_ENDPOINT = process.env.APPWRITE_API_ENDPOINT;
const APPWRITE_API_KEY= process.env.APPWRITE_API_KEY;

export default async ({ res, req, log, error }: Context) => {
	if (!APPWRITE_PROJECT_ID || !APPWRITE_BUCKET_ID || !APPWRITE_API_ENDPOINT || !APPWRITE_API_KEY) {
		error(
			"Please make sure you have environment variables set.",
		);
		return;
	}
	const client = new Client()
		.setEndpoint(APPWRITE_API_ENDPOINT) // Your API Endpoint
		.setProject(APPWRITE_PROJECT_ID)
		.setKey(APPWRITE_API_KEY);

  const bucket = new Storage(client);
  const fileId =  req.path.replace(/^(\/)|(\/)$/g, '');
	log("FILE ID: " + fileId);
	log("BUCKET ID: " + APPWRITE_BUCKET_ID);
    if(req.method === 'GET') {
		try {
			const file = await bucket.getFileDownload(APPWRITE_BUCKET_ID,  fileId);
			return res.send(file, 200);
		} catch (err) {
			error(err.message)
			return res.json({ error: err.message }, 500);
		}
        
    }
};
