export default class SurveyResponse {
    [x: string]: any;
    id?: string;
    survey_id!: string;
    collector_id!: string;
    time_spent?: string;
    complete_status?: number;
    ip_address?: string;
    email_address?: string;
    mobile_number?: string;
    first_name?: string;
    last_name?: string;
    alert_status?: number;
    active?: number;
    created_at?: Date;
    modified_at?: Date;
    deleted_at?: Date;
    created_date?: string;
    modified_date?: string;
    constructor(
        id: string,
        survey_id: string,
        collector_id: string
    ) {
        this.id = id;
        this.survey_id = survey_id;
        this.collector_id = collector_id;
    } 
}