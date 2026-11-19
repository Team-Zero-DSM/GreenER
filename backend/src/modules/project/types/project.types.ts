import type { Account } from '../../accounts/types/accounts.types.js';

export interface ProjectMember extends Account {
    active: boolean;
}
