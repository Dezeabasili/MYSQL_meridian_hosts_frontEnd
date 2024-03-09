import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";
import { baseURL } from "../../context/authContext";

const GetBooking = () => {
  const location = useLocation();
  const bookingToDisplay = location.state?.bookingToDisplay;
  const axiosWithInterceptors = useAxiosInterceptors();
  const navigate = useNavigate();
  const pathname = location.pathname

  const deleteThisBooking = async () => {
    try {
      await axiosWithInterceptors.delete(`/bookings/${bookingToDisplay.id_bookings}`);     
      if (location.state?.pathname === '/mybookings') {
        navigate("/mybookings");
      } else  {
        navigate("/bookings");
      }
  
    } catch (err) {
      if (err.response?.data?.message) {
        navigate('/handleerror', {state: {message: err.response?.data?.message, path: location.pathname}})
      } else {
        navigate('/somethingwentwrong')
      }
    }
  };

  return (
    <div>
      <p>Booking reference: {bookingToDisplay.id_bookings}</p>
      <p>Customer name: <span style={{"textTransform": "capitalize"}}>{bookingToDisplay.user.name}</span></p>
      <p>Hotel name: <span style={{"textTransform": "capitalize"}}><strong>{bookingToDisplay.hotel.name}</strong></span></p>
      <p>Booking date: {format(new Date(bookingToDisplay.createdAt), "MMM/dd/yyyy,  hh:mm:ss bbb")}</p>
      {bookingToDisplay.bookingDetails.map((roomDetails) => (
        <div key={roomDetails.room_id}>
          <br />
          <p>Room type: <span style={{"textTransform": "capitalize"}}>{roomDetails.room_type}</span></p>
          <p>Price per night: ${roomDetails.price_per_night}</p>
          <p>Room number: {roomDetails.roomNumber}</p>
          <p>Check-in date: {format(new Date(roomDetails.checkin_date), "MMM/dd/yyyy")}</p>
          <p>Check-out date: {format(new Date(roomDetails.checkout_date), "MMM/dd/yyyy")}</p>
          <p>Number of nights: {roomDetails.number_of_nights}</p>
        </div>
      ))}
      <br />
      <button
        onClick={() => {
          deleteThisBooking();
        }}
      >
        Cancel this booking
      </button>
    </div>
  );
};

export default GetBooking;
