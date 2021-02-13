import { AuthErrorMessage } from './auth-error-message.model';
export class AuthFieldModel {
    name: string;
    required: boolean;
    type: string;
    value: string;
    messages: AuthErrorMessage [];
}
