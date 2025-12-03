import { Injectable } from '@nestjs/common';

@Injectable()
export class WebDavService {
  private readonly webdavUrl: string;
  private readonly webdavUser: string;
  private readonly webdavPassword: string;
  private readonly webdavBasePath: string;

  constructor() {
    this.webdavUrl = process.env.WEBDAV_URL;
    this.webdavUser = process.env.WEBDAV_USER;
    this.webdavPassword = process.env.WEBDAV_PASSWORD;
    this.webdavBasePath = process.env.WEBDAV_BASE_PATH;
  }

  async uploadFile(buffer: Buffer, filename: string, folder?: string): Promise<string> {
    const path = folder ? `${this.webdavBasePath}/${folder}/${filename}` : `${this.webdavBasePath}/${filename}`;
    const url = `${this.webdavUrl}${path}`;

    const auth = Buffer.from(`${this.webdavUser}:${this.webdavPassword}`).toString('base64');

    const uint8Array = new Uint8Array(buffer);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': buffer.length.toString(),
      },
      body: uint8Array,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload file to WebDAV: ${response.status} ${response.statusText}`);
    }

    return url;
  }

  async deleteFile(filename: string, folder?: string): Promise<void> {
    const path = folder ? `${this.webdavBasePath}/${folder}/${filename}` : `${this.webdavBasePath}/${filename}`;
    const url = `${this.webdavUrl}${path}`;

    const auth = Buffer.from(`${this.webdavUser}:${this.webdavPassword}`).toString('base64');

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to delete file from WebDAV: ${response.status} ${response.statusText}`);
    }
  }

  async fileExists(filename: string, folder?: string): Promise<boolean> {
    const path = folder ? `${this.webdavBasePath}/${folder}/${filename}` : `${this.webdavBasePath}/${filename}`;
    const url = `${this.webdavUrl}${path}`;

    const auth = Buffer.from(`${this.webdavUser}:${this.webdavPassword}`).toString('base64');

    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    return response.ok;
  }
}