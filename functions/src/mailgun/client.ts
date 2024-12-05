import axios from 'axios';
import { getSecret } from './secrets';

export interface MailgunBaseOptions {
	from?: string;
	subject?: string;
	variables?: Record<string, any>;
	recipients: string[];
	recipientsVariables?: Record<string, any>;
}

export interface CustomEmailOptions extends MailgunBaseOptions {
	html?: string;
	text?: string;
}

export interface TemplateEmailOptions extends MailgunBaseOptions {
	template: string;
}

export async function sendCustomEmail(
	options: CustomEmailOptions
): Promise<void> {
	const {
		from,
		subject,
		variables = {},
		recipients,
		recipientsVariables = {},
		html,
		text,
	} = options;

	if (from === undefined) {
		throw new Error(
			'Failed to send custom email via Mailgun. Missing (property) `from`.'
		);
	}

	if (subject === undefined) {
		throw new Error(
			'Failed to send custom email via Mailgun. Missing (property) `subject`.'
		);
	}

	const MAILGUN_API_KEY = await getSecret('MAILGUN_API_KEY');
	const MAILGUN_DOMAIN = await getSecret('MAILGUN_DOMAIN');

	const data = new URLSearchParams();

	data.append('from', from);
	data.append('to', recipients.join(','));
	data.append('subject', subject);

	if (html) {
		data.append('html', html);
	}
	if (text) {
		data.append('text', text);
	}

	if (Object.keys(variables).length > 0) {
		data.append('t:variables', JSON.stringify(variables));
	}

	if (Object.keys(recipientsVariables).length > 0) {
		data.append('recipient-variables', JSON.stringify(recipientsVariables));
	}

	const auth = {
		username: 'api',
		password: MAILGUN_API_KEY,
	};

	try {
		await axios.post(
			`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
			data,
			{ auth }
		);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(
				'Error sending custom email via Mailgun:',
				error.response?.data || error.message
			);
		} else if (error instanceof Error) {
			console.error(
				'Error sending custom email via Mailgun:',
				error.message
			);
		} else {
			console.error('Error sending custom email via Mailgun:', error);
		}
		throw new Error('Failed to send custom email via Mailgun.');
	}
}

export async function sendTemplateEmail(
	options: TemplateEmailOptions
): Promise<void> {
	const {
		from,
		template,
		variables = {},
		recipients,
		recipientsVariables = {},
	} = options;

	const MAILGUN_API_KEY = await getSecret('MAILGUN_API_KEY');
	const MAILGUN_DOMAIN = await getSecret('MAILGUN_DOMAIN');

	const data = new URLSearchParams();
	data.append('to', recipients.join(','));
	data.append('template', template);

	if (from) {
		data.append('from', from);
	}

	if (Object.keys(variables).length > 0) {
		data.append('t:variables', JSON.stringify(variables));
	}

	if (Object.keys(recipientsVariables).length > 0) {
		data.append('recipient-variables', JSON.stringify(recipientsVariables));
	}

	const auth = {
		username: 'api',
		password: MAILGUN_API_KEY,
	};

	try {
		await axios.post(
			`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
			data,
			{ auth }
		);
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(
				'Error sending template email via Mailgun:',
				error.response?.data || error.message
			);
		} else if (error instanceof Error) {
			console.error(
				'Error sending template email via Mailgun:',
				error.message
			);
		} else {
			console.error('Error sending template email via Mailgun:', error);
		}
		throw new Error('Failed to send template email via Mailgun.');
	}
}
