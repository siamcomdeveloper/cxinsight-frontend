export default class Project {
    id?: string;
    name?: string;
    active?: number;
    constructor(
        id: string,
        name: string,
        active: number,
    ) {
        this.id = id;
        this.name = name;
        this.active = active;
    }
}