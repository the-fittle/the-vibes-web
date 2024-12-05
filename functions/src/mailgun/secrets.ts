import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();
const cache: { [key: string]: string } = {};

export async function getSecret(name: string): Promise<string> {
	if (cache[name]) {
		return cache[name];
	}

	const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
	if (!projectId) {
		throw new Error('Project ID is not set in environment variables.');
	}

	const [version] = await client.accessSecretVersion({
		name: `projects/${projectId}/secrets/${name}/versions/latest`,
	});

	const payload = version.payload?.data?.toString();
	if (!payload) {
		throw new Error(`Secret ${name} not found.`);
	}

	cache[name] = payload;
	return payload;
}
