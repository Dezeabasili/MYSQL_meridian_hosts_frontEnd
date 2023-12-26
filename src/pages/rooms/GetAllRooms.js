import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import "./getAllBookings.css";
import useAxiosInterceptors from "../../hooks/useAxiosWithInterceptors";

const GetAllRooms = () => {
  const [roomsList, setRoomsList] = useState();
  const [loading, setLoading] = useState(true);
  const runOnce = useRef(false)
  const navigate = useNavigate();
  const location = useLocation();
  const axiosWithInterceptors = useAxiosInterceptors();

  useEffect(() => {
    if (runOnce.current === false) {
      const rooms = async () => {
        setLoading(true);
        try {
          if (location.state) {
              setRoomsList(location.state);
          
          } else {
            const resp = await axiosWithInterceptors.get("/rooms");
            console.log("rooms: ", resp.data.data);
            setRoomsList([...resp.data.data]);
          }
  
          setLoading(false);
        } catch (err) {
          console.log(err);
        }
      };
  
      rooms();
    }

    return () => {
      runOnce.current = true
    }

  }, []);

  const showSelectedRoom = (room_id) => {
    const roomToDisplay = roomsList.find(
      (room) => room_id === room._id
    );
    navigate(`/rooms/${room_id}`, { state: roomToDisplay });
  };

  return (
    <div>
      {loading ? (
        <p>Loading !!!</p>
      ) : (
        <>
          {roomsList.length > 0 ? (
            <>
              {roomsList?.map((room) => (
                <div key={room._id}>
                  <p>Room reference: {room._id}</p>
                  <p>Hotel name: <span style={{"text-transform": "capitalize"}}>{room.hotel.name}</span></p>
                  <p>Room title: <span style={{"text-transform": "capitalize"}}>{room.title}</span></p>
                  <p>Room price: ${room.price}</p>
                  <p>Room description: {room.description}</p>
                  <p>Maximum number of occupants: {room.maxPeople}</p>
                  <button onClick={() => showSelectedRoom(room._id)} style={{marginTop: '5px'}}>
                    Show room details
                  </button>
                  <br />
                  <br />
                </div>
              ))}
            </>
          ) : (
            <p>No room in the database !!!</p>
          )}
        </>
      )}
    </div>
  );
};

export default GetAllRooms;

