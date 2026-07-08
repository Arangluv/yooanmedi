import { EndPointResultManager, LoggerV2 } from '@/shared';
import { getPayload } from '@/shared/server';

export async function POST(request: Request) {
  try {
    const payload = await getPayload();
    const file = (await request.formData()).get('file') as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadedFile = await payload.create({
      collection: 'files',
      data: {},
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    });

    return Response.json(EndPointResultManager.okWithData({ data: uploadedFile }));
  } catch (error) {
    LoggerV2.error(error);
    return Response.json(EndPointResultManager.fail('파일을 업로드하는데 문제가 발생했습니다'));
  }
}
