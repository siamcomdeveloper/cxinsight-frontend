export default class Answer {
    id?: string;
    survey_id!: string;
    collector_id!: string;
    response_id!: string;
    question_id!: string;
    question_type_id!: string;

    answer?: string;
    comment?: string;
    analyze_entity?: string;
    analyze_sentiment?: string;

    skip_status!: number;
    alert_status!: number;
    active?: number;
    created_at?: Date;
    modified_at?: Date;
    deleted_at?: Date;
    constructor(
        id: string,
        survey_id: string,
        collector_id: string,
        response_id: string,
        question_id: string,
        question_type_id: string,
        skip_status: number,
        alert_status: number
    ) {
        this.id = id;
        this.survey_id = survey_id;
        this.collector_id = collector_id;
        this.response_id = response_id;
        this.question_id = question_id;
        this.question_type_id = question_type_id;
        this.skip_status = skip_status;
        this.alert_status = alert_status;
    } 
}