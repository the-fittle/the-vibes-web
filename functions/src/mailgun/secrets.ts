// secrets.ts
import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

const secretClient = new SecretManagerServiceClient()
const secretCache: Record<string, string> = {}

/**
 * Fetches a secret from Google Cloud Secret Manager.
 * Caches the secret to reduce overhead on subsequent calls.
 * @param secretName - The name of the secret to retrieve.
 * @returns The secret value as a string.
 */
export async function getSecret ( secretName: string ): Promise<string>
{
    if ( secretCache[ secretName ] )
    {
        return secretCache[ secretName ]
    }

    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT
    if ( !projectId )
    {
        throw new Error( 'GCP Project ID not found in environment variables.' )
    }

    const name = `projects/${ projectId }/secrets/${ secretName }/versions/latest`

    try
    {
        const [ version ] = await secretClient.accessSecretVersion( { name } )
        const payload = version.payload?.data?.toString()

        if ( !payload )
        {
            throw new Error( `Secret ${ secretName } is empty or not found.` )
        }

        secretCache[ secretName ] = payload
        return payload
    } catch ( error )
    {
        console.error( `Failed to access secret ${ secretName }:`, error )
        throw new Error( `Could not retrieve secret ${ secretName }.` )
    }
}
