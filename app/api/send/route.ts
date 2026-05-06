import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'Direct client-side submission used instead' }, { status: 410 });
}