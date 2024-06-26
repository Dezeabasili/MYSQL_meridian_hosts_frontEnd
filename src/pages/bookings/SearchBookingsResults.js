import { useNavigate, useLocation } from "react-router-dom";
import { format } from "date-fns";
import "./getAllBookings.css";
import { formatDate } from "./bookings_Utility_Functions"

const SearchBookingsResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingsList = [...location.state?.bookingsToDisplay];
  
  const pathname = location.pathname

  const showSelectedBooking = (booking_id) => {
    const bookingToDisplay = bookingsList.find(
      (booking) => booking_id === booking.id_bookings
    );
    navigate(`/bookings/${booking_id}`, { state: {pathname, bookingToDisplay}, replace: true });
  };

  return (
    <div>   
          {bookingsList.length > 0 ? (
            <>
              {bookingsList?.map((booking) => (
                <div key={booking.id_bookings}>
                  <p>Booking reference: {booking.id_bookings}</p>
                  <p>Customer name: <span style={{"textTransform": "capitalize"}}>{booking.user.name}</span></p>          
                  <p>Hotel name: <span style={{"textTransform": "capitalize"}}><strong>{booking.hotel.name}</strong></span></p>
                  <p>Booking date: {format(new Date(booking.createdAt), "MMM/dd/yyyy,  hh:mm:ss bbb")}</p>
                  <button onClick={() => showSelectedBooking(booking.id_bookings)} style={{marginTop: '5px'}}>
                    Show booking details
                  </button>
                  <br />
                  <br />
                </div>
              ))}
            </>
          ) : (
            <p>No booking in the database !!!</p>
          )}     
    </div>
  );
};

export default SearchBookingsResults;

