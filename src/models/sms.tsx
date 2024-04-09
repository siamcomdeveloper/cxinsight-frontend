export default class Email {
    id?: string;
    collector_id!: string;
    mobile_number!: string;
    first_name?: string;
    last_name?: string;
    active?: number;

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
        this.mobile_number = email_address;
        this.first_name = first_name;
        this.last_name = last_name;
        this.active = active;
    }
}