import { createWriteStream } from 'fs';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  const uploadDir = join(process.cwd(), 'uploads');

  try {
    await fs.promises.mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error('Failed to create upload directory:', err.message);
    return { success: false, error: 'Server error' };
  }

  try {
    const formData = await readMultipartFormData(event);
    const file = formData.find((item) => item.type === 'file');

    if (!file) {
      throw new Error('No file found');
    }

    const filePath = join(uploadDir, file.filename);
    const writeStream = createWriteStream(filePath);
    writeStream.write(file.data);
    writeStream.end();

    return { success: true };
  } catch (error) {
    return { success: false, error: error?.message };
  }
});
