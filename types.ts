export interface User {
    id: string;
    first_name?: string;
    second_name?: string;
    birthdate?: string;
    biography?: string;
    city?: string;
    password: string;
    friends: Set<string>;
}
export interface Post {
    id: string;
    text: string;
    author_user_id: string;
}

export interface DialogMessage {
    id: string;
    from: string;
    to: string;
    text: string;
    timestamp: string;
}
