import "reflect-metadata"

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
    namespace App {
		interface Policy {
			id?: string;
			name: string;
			description: string;
			createdBy: string;
			rules: PolicyRule[];
		}

		type PolicyMethod = 'sign_event'| 'nip04_encrypt'| 'nip04_decrypt';

		interface PolicyRule {
			method: PolicyMethod;
			kind?: number | string;
			useCount?: number;
			expiresAt?: Date;
		};

		interface Token {
			id?: string;
			clientName: string;
			expiresAt: Date;
		}

		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}