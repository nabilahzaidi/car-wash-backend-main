import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { ServiceRoutes } from "../modules/Services/service.route";
import { ServiceSlotsRoutes } from "../modules/serviceSlots/serviceSlots.route";
import { serviceBookingRoutes } from "../modules/booking/booking.route";

import { userBookingRoutes } from "../modules/userBooking/userBooking.route";
import { paymentRoutes } from "../modules/payment/payment.route";
import { ReviewsRoutes } from "../modules/reviews/reviews.route";



const router = Router()





const moduleRoutes = [
    {
        path:"/auth",
        route: UserRoutes,
    },
    {
        path:"/services",
        route: ServiceRoutes,
    },
    {
        path:"/slots",
        route: ServiceSlotsRoutes,
    },
    {
        path:"/bookings",
        route: serviceBookingRoutes,
    },
    {
        path:"/my-bookings",
        route: userBookingRoutes,
    },
    {
        path:"/payment",
        route: paymentRoutes,
    },
    {
        path:"/reviews",
        route: ReviewsRoutes,
    },

]


moduleRoutes.forEach((route)=>{
    router.use(route.path,route.route)
})


export default router;