import { AuthMethodModel } from './auth-method.model';


export class AuthConfigModel {
    id: string;
    // tslint:disable-next-line:variable-name
    expires_at: Date;
    forced: boolean;
    // tslint:disable-next-line:variable-name
    issued_at: Date;
    messages: any[];
    // tslint:disable-next-line:variable-name
    request_url: string;
    methods: {
        oidc: AuthMethodModel;
        password: AuthMethodModel;
        link: AuthMethodModel;
        profile: AuthMethodModel;
    };
    state: string;
}
