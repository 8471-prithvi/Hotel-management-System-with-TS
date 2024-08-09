// types.ts
export interface Room {
    room_no: number;
    room_status: boolean;
}

export interface Customer {
    id: string;
    name: string;
    mobileNumber: string;
    idType: string;
    idNumber: string;
}

export interface Booking {
    roomNumber: number;
    checkInDate: string;
    nights: number;
    customerId: string;
}

export interface Hotel {
    name: string;
    location: string;
    price: number;
    rooms: Room[];
    customers: Customer[];
    bookings: Booking[];
}
