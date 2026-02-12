import { NextResponse } from 'next/server';
import { getUserByHeader } from '@/entities/user';

export async function GET({}) {
  const user = await getUserByHeader();

  return NextResponse.json(user);
}
