export default class Email {
    id?: string;
    collector_id!: string;
    email_address!: string;
    first_name?: string;
    last_name?: string;
    // sent?: string;
    // responded?: string;
    active?: number;
    // created_at?: Date;
    // modified_at?: Date;
    // deleted_at?: Date;

    constructor(
        id: string,
        email_address: string,
        first_name: string,
        last_name: string,
        collector_id: string,
        active: number,
    ) {
        this.id = id;
        this.collector_id = collector_id;
        this.email_address = email_address;
        this.first_name = first_name;
        this.last_name = last_name;
        this.active = active;
    }
}