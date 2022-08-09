export interface IUser {
    id: number;
    username: string;
    password?: string;
    authorities: Array<string>;
}

export class User implements IUser {
    public password?: string | undefined;

    constructor(
        public id: number,
        public username: string,
        public authorities: Array<string>,
    ) { }
}
