export class GomangoUser {
    id: string;
    // tslint:disable-next-line:variable-name
    authenticated_at: string;
    // tslint:disable-next-line:variable-name
    expires_at: string;
    active: boolean;
    // tslint:disable-next-line:variable-name
    issued_at: string;
    identity: {
        id: string;
        schema_id: string;
        schema_url: string;
        traits: {
            email: string;
            name?: {
                first: string;
                last: string;
            }
        },
        recovery_addresses: {
            id: string;
            value: string;
            via: string;
        }[],
        verifiable_addresses: {
            id: string;
            status: string;
            value: string;
            verified: boolean;
            verified_at: string;
            via: string;
        }[]
    }
}