export default class Surveys {
    [x: string]: any;
    id?: string;
    name?: string;
    owner_user_id?: string;
    touchpoint_id?: string;
    project_id?: string;
    status?: number;
    num_page?: string;
    num_question?: string;
    total_responses?: string;
    normal_responses?: string;
    good_responses?: string;
    bad_responses?: string;
    responses_volume_id?: string;
    alert_status?: string;
    completion_rate?: number;
    time_spent?: string;
    num_collector?: number;
    notification_status?: number;
    subscriber?: any;
    enable_src_type?: number;
    image_src?: string;
    banner_src?: string;
    active?: number;
    created_at?: Date;
    modified_at?: Date;
    deleted_at?: Date;
    template_name?: string;
    status_name?: string;
    created_date?: string;
    modified_date?: string;

    touchpoint_name?: string;
    project_name?: string;

    constructor(
        id: string,
        name: string,
        touchpoint_id: string
    ) {
        this.id = id;
        this.name = name;
        this.touchpoint_id = touchpoint_id
    } 
}