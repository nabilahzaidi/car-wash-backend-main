import { initiatePayment } from "../payment/payment.utils";
import { Service } from "../Services/service.model";
import { User } from "../user/user.model";
import { TBooking } from "./booking.interface";
import { ServiceBooking } from "./booking.model";
import { ServicesSlot } from "../serviceSlots/serviceSlots.model";


const createServiceBookingIntoDB = async(payload: TBooking)=>{


    const transactionId = `txn-${Date.now()}`;
    const orderData = {...payload,transactionId}

    const createOrder = await ServiceBooking.create(orderData);

if (!createOrder) {
    throw new Error('Booking creation failed.');
}

const service = await Service.findById(orderData.service);
const user = await User.findById(orderData.customer);

const totalPrice = service?.price || 0;

const paymentData = {
    transactionId,
    totalPrice,
    customerName: user?.name || orderData.customerName || 'Customer',
    customerEmail: user?.email || orderData.customerEmail,
    customerPhone: user?.phone || orderData.customerPhone,
    customerAddress: user?.address || orderData.customerAddress,
};

const paymentSession = await initiatePayment(paymentData);

return paymentSession;
}



//get all booking admin
const getAllServiceBookingFromDB = async ()=>{
    const result = ServiceBooking.find()
    .populate('customer service slot','-role -__v -createdAt -updatedAt').select('-__v')
    .sort({createdAt:-1})
    return result;
}



//get users all booking get user
const getUsersBookingsFromDB = async (userId: string)=>{
   
    

    const result = await ServiceBooking.find({customer: userId})
    .populate('service slot','-__v -createdAt -updatedAt').select('-customer -__v')
  
    
    return result;
}

// update booking (approve/reject or other updates)
const updateBookingInDB = async (bookingId: string, payload: Partial<any>) => {
    const booking = await ServiceBooking.findByIdAndUpdate(bookingId, payload, { new: true });
    if (!booking) throw new Error('Booking not found');

    // if approved or completed, mark slot as booked
    if ((payload.status === 'Approved' || payload.status === 'Completed') && booking.slot) {
        await ServicesSlot.findByIdAndUpdate(booking.slot, { isBooked: 'booked' });
    }

    // if rejected or canceled, free the slot
    if ((payload.status === 'Rejected' || payload.status === 'canceled') && booking.slot) {
        await ServicesSlot.findByIdAndUpdate(booking.slot, { isBooked: 'available' });
    }

    return booking;
}

// export extended services
export const serviceBookings = Object.assign({
    updateBookingInDB
}, { createServiceBookingIntoDB, getAllServiceBookingFromDB, getUsersBookingsFromDB });