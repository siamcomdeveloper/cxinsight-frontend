export default class Question {
    id?: string;
    survey_id!: string;
    page_no!: string;
    type_id!: string;
    question_label!: string;
    order_no!: string;
    required!: number;
    active?: number;
    created_at?: Date;
    modified_at?: Date;
    deleted_at?: Date;
    constructor(
        id: string,
        survey_id: string,
        page_no: string,
        type_id: string,
        question_label: string,
        order_no: string,
        required: number
    ) {
        this.id = id;
        this.survey_id = survey_id;
        this.page_no = page_no;
        this.type_id = type_id;
        this.question_label = question_label;
        this.order_no = order_no;
        this.required = required;
    } 
}