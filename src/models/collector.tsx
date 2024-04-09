export default class Collector {
    [x: string]: any;
    id?: string;
    survey_id!: string;
    name!: string;
    type!: string;
    status?: number;

    project_id?: string;

    link!: string;
    responses?: string;

    subject?: string;
    message?: string;

    send?: number;
    send_date?: Date;
    cutoff?: number;
    cutoff_date?: Date;
    anonymous?: number;

    color_theme?: string;
    active?: number;
    created_at?: Date;
    modified_at?: Date;
    deleted_at?: Date;
    // template_name?: string;
    // status_name?: string;
    created_date?: string;
    modified_date?: string;
    // rem_lnk?: string;

    constructor(
        id: string,
        name: string,
        survey_id: string,
        type: string,
        link: string
    ) {
        this.id = id;
        this.name = name;
        this.survey_id = survey_id;
        this.type = type;
        this.link = link;
    } 
}