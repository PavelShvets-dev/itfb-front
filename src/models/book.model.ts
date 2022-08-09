import { Author } from "./author.model";

export interface IBook {
    id: number;
    name: string;
    authors: Array<Author>;
}

export class Book implements IBook {
    constructor(
        public id: number,
        public name: string,
        public authors: Array<Author>,
    ) { }
}
