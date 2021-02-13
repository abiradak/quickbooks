import { AuthFieldModel } from './auth-field.model';
import { AuthMessageModel } from './auth-message.model';


export class AuthMethodConfigModel {
    action: string;
    fields: AuthFieldModel[];
    method: string;
    messages: AuthMessageModel[];
}
