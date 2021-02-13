import { AccountType } from './account-type.enum';
import { Contact } from './contact.model';

export class Account{
    // Maps to GomangoUser.Identity.id
    id?: string;

    orgId: string;

    firstName: string;
    lastName: string;
    // should be AccountType.APP_USER
    type: AccountType;

    // Maps to GomangoUser.Identity.traits.email
    email: string;
    contact?: Contact[];
    orgName?: string;

    // map to !environment.approvalRequired at account creation (if environment.approvalRequired is true, this should be false)
    approved: boolean;
}
