import type { VercelRequest, VercelResponse } from '@vercel/node';
import jsftp from 'jsftp';
import { allowCors } from '../middleware/allowCors';

const {
  FTP_HOST,
  FTP_PORT,
  FTP_USER,
  FTP_PASSWORD,
} = process.env;

const ftp = new jsftp({
  host: FTP_HOST,
  port: FTP_PORT,
  user: FTP_USER,
  pass: FTP_PASSWORD,
});

const upload = (buffer, fileName) => {
  return new Promise((resolve, reject) => {
    ftp.put(buffer, fileName), err => {
      if (err) {
        reject(err);
      }
      console.log("File transferred successfully!");
      resolve(`${fileName} uploaded 🚀`);
    }
  });
};

const baseHost = process.env.FILE_HOST;
const imageRepository = process.env.IMAGE_FOLDER;

const handler = async (
  req: VercelRequest,
  res: VercelResponse,
)  => {
  try {
    console.log('request 👉', req);
    const file = req.body;
    const fileName = `aa.png`;
    const response = await upload(file, `${imageRepository}/${fileName}`);
    console.log('response 👉', response);
    res.status(200).json({
      message: response,
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