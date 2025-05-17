import { File } from '@web-std/file';
import { randomUUID } from 'crypto';
import { PinataSDK } from 'pinata';
export const pinata = new PinataSDK({
	pinataJwt: process.env.PINATA_JWT,
	pinataGateway: process.env.GATEWAY_URL,
});

export async function uploadFile(base64: string | undefined) {
	if (base64) {
		const type = base64.substring(
			'data:image/'.length,
			base64.indexOf(';base64'),
		);
		const file = new File(
			[await (await fetch(base64)).blob()],
			`${randomUUID()}.${type}`,
			{ type: `image/${type}` },
		);
		const created = await pinata.upload.file(file);
		return created.cid;
	}
}
