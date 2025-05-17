import { getFileByCid } from '@/app/lib/ipfs-action';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
	// If you're going to use auth you'll want to verify here
	const cid = request.nextUrl.searchParams.get('cid')!;
	const file = await getFileByCid(cid);
	const response = new NextResponse(file, { status: 200 });
	return response;
}
