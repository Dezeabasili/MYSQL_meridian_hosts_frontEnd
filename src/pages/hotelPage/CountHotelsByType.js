import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseURL } from "../../context/authContext";

const CountHotelsByTypes = () => {
  const [loading, setLoading] = useState(true);
  const [hotelData, setHotelData] = useState();
  const runOnce = useRef(false)

  useEffect(() => {
    if (runOnce.current === false) {
      const displayData = async () => {
        setLoading(true);
        try {
          const resp = await axios.get(baseURL + "api/v1/hotels/countbytype");
          // console.log(resp.data.data);
          setHotelData([...resp.data.data]);
          setLoading(false)
        } catch (err) {
          console.log(err);
        }
      };
  
      displayData();
    }

    return () => {
      runOnce.current = true
    }
    
  }, []);


  return (
    <div>
      {loading ? (
        <p>Loading !!!</p>
      ) : (
        <>
          {hotelData.map((hotelType) => (    
            <div key={hotelType.hotelType}>
              <h5> <span style={{"textTransform": "capitalize"}}>{hotelType.hotelType}</span></h5>
              <p>{hotelType.numberOfHotels} {hotelType.numberOfHotels == 1 ? 'property' : 'properties'}</p>
              <br />
            </div>    
          ))}
        </>
      )}
    </div>
  );
};

export default CountHotelsByTypes;
