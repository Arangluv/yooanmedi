import { NextResponse } from 'next/server';
import { APIError } from 'payload';
import { PayloadCms } from '@/shared/server';
import { CartAdapter, CartApiRepository } from '@/entities/cart/infrastructure';

export async function POST(request: Request) {
  const cartRepository = new CartApiRepository(CartAdapter());

  try {
    const payload = await PayloadCms.getInstance();
    const formData = await request.formData();

    const id = formData.get('id') as string;
    const password = formData.get('password') as string;
    const ceo = formData.get('ceo') as string;
    const hospitalName = formData.get('hospitalName') as string;
    const email = formData.get('email') as string;
    const address = formData.get('fullAddress') as string;
    const addressDetail = formData.get('addressDetail') as string;
    const businessNumber = formData.get('businessNumber') as string;
    const nursingNumber = formData.get('nursingNumber') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const faxNumber = formData.get('faxNumber') as string;
    const doctorLicenseNumber = formData.get('doctorLicenseNumber') as string;

    const userFullAddress = `${address} | ${addressDetail}`;

    const uploadedFileIds: number[] = [];

    const fileEntries = formData
      .getAll('fileList')
      .filter((file): file is File => file instanceof File);

    // 파일 업로드
    for (const file of fileEntries) {
      if (!file.size || !file.name) continue;

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

      uploadedFileIds.push(uploadedFile.id);
    }

    // 유저 생성
    const user = await payload.create({
      collection: 'users',
      data: {
        username: id,
        password,
        ceo,
        hospitalName,
        email,
        contactEmail: email,
        role: 'client',
        address: userFullAddress,
        businessNumber,
        nursingNumber,
        phoneNumber,
        faxNumber,
        fileList: uploadedFileIds,
        doctorLicenseNumber,
      },
    });

    await cartRepository.create({ user: user.id });

    return NextResponse.json({
      success: true,
      message: '',
    });
  } catch (error) {
    console.error(error);

    if (error instanceof APIError) {
      const firstError = error.data?.errors?.[0];

      if (firstError?.path === 'user_id') {
        return NextResponse.json({
          success: false,
          message: '이미 사용중인 아이디입니다.',
        });
      }

      if (firstError?.path === 'businessNumber') {
        return NextResponse.json({
          success: false,
          message: '이미 사용중인 사업자등록번호입니다.',
        });
      }

      if (firstError?.path === 'nursingNumber') {
        return NextResponse.json({
          success: false,
          message: '이미 사용중인 요양기관번호입니다.',
        });
      }

      return NextResponse.json({
        success: false,
        message: firstError?.message ?? '회원가입에 실패했습니다.',
      });
    }

    return NextResponse.json({
      success: false,
      message: '회원가입시 알 수 없는 오류가 발생했습니다.',
    });
  }
}
