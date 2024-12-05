import {
	sendCustomEmail as mailgunSendCustomEmail,
	sendTemplateEmail as mailgunSendTemplateEmail,
	CustomEmailOptions,
	TemplateEmailOptions,
} from './client';

/**
 * Sends a custom email with specified HTML or text content.
 * @param options - The email sending options.
 */
export async function sendCustomEmail(
	options: CustomEmailOptions
): Promise<void> {
	await mailgunSendCustomEmail(options);
}

/**
 * Sends an email using a Mailgun template.
 * @param options - The email sending options.
 */
export async function sendTemplateEmail(
	options: TemplateEmailOptions
): Promise<void> {
	await mailgunSendTemplateEmail(options);
}
