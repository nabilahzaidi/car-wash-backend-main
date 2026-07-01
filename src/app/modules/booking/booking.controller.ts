import httpStatus from 'http-status';
import { ObjectId } from 'mongoose';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { serviceBookings } from './booking.services';
import { User } from '../user/user.model';
import { ServicesSlot } from '../serviceSlots/serviceSlots.model';
import AppError from '../../errors/AppError';


const createServiceBooking = catchAsync(async (req, res) => {
  const bookingData = req.body;


  const user = req.user;

  if (!user || !user.userEmail) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User information is missing.');
  }


  
  // check service slot 
const checkBookedSolt = await ServicesSlot.findById(bookingData.slotId);
if(!checkBookedSolt || checkBookedSolt.isBooked === 'booked'){
  throw new AppError(httpStatus.BAD_REQUEST,"Slot is already booked")
}


const checkBookedSlotServiceId =  checkBookedSolt.service.toHexString();
const bookingDataServiceId =  bookingData.serviceId



if(checkBookedSlotServiceId !== bookingDataServiceId){
  throw new AppError(httpStatus.BAD_REQUEST,"Service or Slot is not valid")
}

  const customer = await User.findOne({ email: user.userEmail });

  bookingData.customer = customer?._id;
  bookingData.service = bookingDataServiceId;
  bookingData.slot = bookingData.slotId;

  // booking succes after update booked
  if (customer) {
    await ServicesSlot.findByIdAndUpdate(
      bookingData.slotId,
      { isBooked: 'processing' },
      { new: true },
    );
  }

  const result = await serviceBookings.createServiceBookingIntoDB(bookingData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking successful',
    data: result,
  });
});




//get all bookings by admin
const getAllBookings = catchAsync(async (req, res) => {
  const result = await serviceBookings.getAllServiceBookingFromDB();
  if (result.length === 0) {
    return sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All bookings retrieved successfully',
    data: result,
  });
});


// update booking (approve/reject)
const updateBooking = catchAsync(async (req, res) => {
  const bookingId = req.params.id;
  const payload = req.body;
  const currentUser = req.user;

  let updatePayload = payload;

  if (currentUser?.role === 'user') {
    const user = await User.findOne({ email: currentUser.userEmail });
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'Current user not found');
    }

    const booking = await ServiceBooking.findById(bookingId);
    if (!booking) {
      throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
    }

    if (booking.customer.toString() !== user._id.toString()) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized to update this booking');
    }

    updatePayload = {
      paymentStatus: payload.paymentStatus,
      transactionId: payload.transactionId,
    };
  }

  const result = await serviceBookings.updateBookingInDB(bookingId, updatePayload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking updated successfully',
    data: result,
  });
});

export const BookingControllers = {
  createServiceBooking,
  getAllBookings,
  updateBooking,
};
