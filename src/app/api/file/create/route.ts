import { LoggerV2 } from '@/shared';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    console.log(formData);

    return Response.json({ ok: true, id: 123 });
  } catch (error) {
    LoggerV2.error(error);
    return Response.json({
      ok: false,
      message: '증빙서류 파일을 업로드하는데 문제가 발생했습니다',
    });
  }
}
