import fs from 'fs';
import qrcode from 'qrcode-terminal';
import { sessionFolderPath } from '../config';
import { sendErrorResponse } from '../utils';

/**
 * Responds to ping request with 'pong'
 *
 * @function ping
 * @async
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Promise that resolves once response is sent
 * @throws {Object} - Throws error if response fails
 */
export const ping = async (req, res) => {
  /*
    #swagger.tags = ['Various']
  */
  try {
    res.json({ success: true, message: 'pong' });
  } catch (error) {
    sendErrorResponse(res, 500, error.message);
  }
};

/**
 * Example local callback function that generates a QR code and writes a log file
 *
 * @function localCallbackExample
 * @async
 * @param {Object} req - Express request object containing a body object with dataType and data
 * @param {string} req.body.dataType - Type of data (in this case, 'qr')
 * @param {Object} req.body.data - Data to generate a QR code from
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Promise that resolves once response is sent
 * @throws {Object} - Throws error if response fails
 */
export const localCallbackExample = async (req, res) => {
  /*
    #swagger.tags = ['Various']
  */
  try {
    const { dataType, data, sessionId } = req.body;
    if (dataType === 'qr') {
      qrcode.generate(data.qr, { small: true });
    }
    if (dataType === 'remote_session_saved') {
      console.log(`Remote session saved for ${sessionId}`);
    }
    fs.writeFile(
      `${sessionFolderPath}/message_log.txt`,
      `${JSON.stringify(req.body)}\r\n`,
      { flag: 'a+' },
      (_) => _,
    );
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    fs.writeFile(
      `${sessionFolderPath}/message_log.txt`,
      `(ERROR) ${JSON.stringify(error)}\r\n`,
      { flag: 'a+' },
      (_) => _,
    );
    sendErrorResponse(res, 500, error.message);
  }
};

export default { ping, localCallbackExample };
