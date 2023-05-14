import type { VercelRequest, VercelResponse } from '@vercel/node';
import { allowCors } from '../middleware/allowCors';
import FTP from "ftp-ts";

const {
  FTP_HOST,
  FTP_USER,
  FTP_PASSWORD,
} = process.env;

const baseHost = process.env.FILE_HOST;
const imageRepository = process.env.IMAGE_FOLDER;

const handler = async (
  req: VercelRequest,
  res: VercelResponse,
)  => {
  try {
    const ftp = await FTP.connect({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
    });
    const file = req.body;
    const { fileName } = req.query;
    await ftp.put(file, `${imageRepository}/${fileName}`);
    res.status(200).json({
      message: `${fileName} successfully uploaded 🚀`,
      url: `${baseHost}/${imageRepository}/${fileName}`
    });
  } catch (error) {
    console.log('Error 💥', error);
    res.status(500).json({
      message: error.message
    });
  }
}

export default allowCors(handler);