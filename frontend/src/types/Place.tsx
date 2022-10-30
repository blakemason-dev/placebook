export interface Coordinate {
    lat: number;
    lng: number;
}

export interface Place {
    id: string;
    title: string;
    description: string;
    imageURL: string;
    address: string;
    creator: string;
    location: Coordinate;
}