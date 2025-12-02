'use server'

import config from '@/payload.config'
import { APIError, getPayload } from 'payload'

export async function join(formData: FormData) {
  const payload = await getPayload({ config: config })

  try {
    const id = formData.get('id') as string
    const password = formData.get('password') as string
    const ceo = formData.get('ceo') as string
    const hospitalName = formData.get('hospitalName') as string
    const email = formData.get('email') as string
    const address = formData.get('fullAddress') as string
    const businessNumber = formData.get('businessNumber') as string
    const nursingNumber = formData.get('nursingNumber') as string
    const phoneNumber = formData.get('phoneNumber') as string
    const faxNumber = formData.get('faxNumber') as string

    // 파일 업로드 - REST API 사용
    const uploadedFileIds: number[] = []
    const fileEntries = formData
      .getAll('fileList')
      .filter((file): file is File => file instanceof File)

    if (fileEntries.length > 0) {
      for (const file of fileEntries) {
        if (file.size > 0 && file.name) {
          try {
            // Payload REST API를 사용하여 파일 업로드
            const uploadFormData = new FormData()
            uploadFormData.append('file', file)
            uploadFormData.append('_payload', JSON.stringify({}))

            // 서버 사이드에서 내부 API 호출
            const baseURL = process.env.SITE_URL || 'http://localhost:3000'
            const apiUrl = `${baseURL}/api/files`

            const response = await fetch(apiUrl, {
              method: 'POST',
              body: uploadFormData,
            })

            if (!response.ok) {
              const errorText = await response.text()
              let errorData
              try {
                errorData = JSON.parse(errorText)
              } catch {
                errorData = { message: errorText }
              }
              throw new Error(`파일 업로드 실패: ${errorData.message || response.statusText}`)
            }

            const uploadedFile = await response.json()
            console.log('uploadedFile')
            console.log(uploadedFile)

            if (uploadedFile?.doc?.id) {
              uploadedFileIds.push(uploadedFile.doc.id) // ID만 push
            }
          } catch (fileError) {
            console.error('파일 업로드 에러:', fileError)
            throw fileError
          }
        }
      }
    }

    const user = await payload.create({
      collection: 'users',
      data: {
        username: id,
        password,
        ceo,
        hospitalName,
        email,
        address,
        businessNumber,
        nursingNumber,
        phoneNumber,
        faxNumber,
        fileList: uploadedFileIds,
      },
    })

    return user
  } catch (error) {
    if (error instanceof APIError) {
      // error.data 예시
      // {
      //   collection: 'users',
      //   errors: [ { message: '해당 이메일은 이미 등록되어 있습니다', path: 'email' } ]
      // }

      if (error.data.errors[0].path === 'user_id') {
        throw new Error('이미 사용중인 아이디입니다.')
      }

      const errorMessage = error.data.errors[0].message
      throw new Error(errorMessage)
    } else {
      throw new Error('회원가입시 알 수 없는 오류가 발생했습니다.')
    }
  }
}
