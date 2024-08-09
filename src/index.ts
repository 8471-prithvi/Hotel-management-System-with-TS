import { Room, Hotel, Booking, Customer } from "./types";
import * as readlineSync from 'readline-sync';

const hotels: Hotel[] = [];
const customers: Customer[] = [];

function showHotels(hotels: Hotel[]): void {
    if (hotels.length === 0) {
        console.log('No hotels available. Please add hotels.');
        return;
    }
    hotels.forEach(hotel => {
        console.log(`Name: ${hotel.name}, Location: ${hotel.location}, Price: ${hotel.price}`);
        console.log('Rooms:');
        hotel.rooms.forEach((room, index) => {
            console.log(`Room No.: ${index + 1}, Status: ${room.room_status ? 'Occupied' : 'Available'}`);
        });
    });
}

function addHotel(newHotel: Hotel): void {
    const isExisting = hotels.find(hotel => hotel.name === newHotel.name && hotel.location === newHotel.location);
    if (isExisting) {
        console.log('This hotel already exists.');
    } else {
        hotels.push(newHotel);
        console.log('Hotel added successfully.');
    }
}

function getHotelInput(): Hotel {
    const name = readlineSync.question('Enter hotel name: ');
    const location = readlineSync.question('Enter hotel location: ');
    const price = parseFloat(readlineSync.question('Enter hotel price: '));

    // Default 2 rooms
    const rooms: Room[] = [
        { room_no: 1, room_status: false },
        { room_no: 2, room_status: false }
    ];

    return { name, location, price, rooms, customers: [], bookings: [] };
}

function getCustomerInput(): Customer {
    const name = readlineSync.question('Enter customer name: ');
    const mobileNumber = readlineSync.question('Enter mobile number: ');
    const idType = readlineSync.question('Enter ID type: ');
    const idNumber = readlineSync.question('Enter ID number: ');

    return { id: `C${Date.now()}`, name, mobileNumber, idType, idNumber };
}

function bookHotel(): void {
    if (hotels.length === 0) {
        console.log('No hotels available to book.');
        return;
    }

    console.log('Available Hotels:');
    showHotels(hotels);

    const hotelName = readlineSync.question('Enter hotel name to book: ');
    const hotel = hotels.find(h => h.name === hotelName);

    if (!hotel) {
        console.log('Hotel not found.');
        return;
    }

    const roomNumber = parseInt(readlineSync.question('Enter room number to book: '), 10);
    const room = hotel.rooms[roomNumber - 1];

    if (!room) {
        console.log('Invalid room number.');
        return;
    }

    if (room.room_status) {
        console.log('Room is already occupied.');
    } else {
        console.log('Welcome to our booking portal');
        const customer = getCustomerInput();
        customers.push(customer);

        const checkInDate = readlineSync.question('Enter check-in date (YYYY-MM-DD): ');
        const nights = parseInt(readlineSync.question('Enter number of nights: '), 10);
        room.room_status = true;
        hotel.bookings.push({ roomNumber, checkInDate, nights, customerId: customer.id });
        console.log(`Room ${roomNumber} in ${hotelName} booked successfully for ${nights} nights starting from ${checkInDate}.`);
    }
}

function billing(): void {
    if (hotels.length === 0) {
        console.log('No bookings done.');
        return;
    }

    const hotelName = readlineSync.question('Enter hotel name for billing: ');
    const hotel = hotels.find(h => h.name === hotelName);

    if (!hotel) {
        console.log('Hotel not found.');
        return;
    }

    const roomNumber = parseInt(readlineSync.question('Enter room number for billing: '), 10);
    const booking = hotel.bookings.find(b => b.roomNumber === roomNumber);

    if (!booking) {
        console.log('Booking not found.');
        return;
    }

    const totalCost = hotel.price * booking.nights;
    console.log(`Total cost for ${booking.nights} nights in room ${roomNumber} of ${hotelName} is ${totalCost}.`);
}

function showBookingsAndCustomers(): void {
    const hotelsWithBookings = hotels.filter(hotel => hotel.bookings.length > 0);

    if (hotelsWithBookings.length === 0) {
        console.log('No bookings available.');
        return;
    }

    hotelsWithBookings.forEach(hotel => {
        console.log(`Hotel: ${hotel.name}`);
        hotel.bookings.forEach(booking => {
            const customer = customers.find(c => c.id === booking.customerId);
            if (customer) {
                console.log(`Room Number: ${booking.roomNumber}, Customer Name: ${customer.name}, Check-in Date: ${booking.checkInDate}, Nights: ${booking.nights}`);
            }
        });
    });
}

function mainMenu(): void {
    console.log("\nHotel Management System");
    console.log("1. Display Hotels");
    console.log("2. Add Hotel");
    console.log("3. Book Hotel");
    console.log("4. Billing");
    console.log("5. Show Bookings and Customers");
    console.log("6. Exit");

    const option = readlineSync.question('Choose an option: ');

    if (hotels.length === 0 && option !== '2') {
        console.log('No hotels available. Add hotels first.');
        addHotel(getHotelInput());
        mainMenu();
        return;
    }

    switch (option) {
        case '1':
            showHotels(hotels);
            break;
        case '2':
            const newHotel = getHotelInput();
            addHotel(newHotel);
            break;
        case '3':
            bookHotel();
            break;
        case '4':
            billing();
            break;
        case '5':
            showBookingsAndCustomers();
            break;
        case '6':
            console.log('Exiting...');
            return;
        default:
            console.log('Invalid option. Please try again.');
    }

    mainMenu();
}

mainMenu();
