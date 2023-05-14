import type { VercelRequest, VercelResponse } from '@vercel/node';
import ftpClient from 'ftp';

const {
  FTP_HOST,
  FTP_PORT,
  FTP_USER,
  FTP_PASSWORD,
} = process.env;

const upload = (file, fileName) => {
  return new Promise((resolve, reject) => {
    const ftp = new ftpClient();
    ftp.on('ready', () => {
      ftp.put(file, fileName, (err) => {
        if (err) {
          ftp.end();
          reject(err);
        } else {
          ftp.end();
          resolve(`${fileName} uploaded 🚀`);
        }
      });
    });

    ftp.on('error', (err) => {
      reject(err);
    });

    ftp.connect({
      host: FTP_HOST,
      port: FTP_PORT,
      user: FTP_USER,
      password: FTP_PASSWORD,
    });
  });
}

const baseHost = process.env.FILE_HOST;
const imageRepository = process.env.IMAGE_FOLDER;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
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