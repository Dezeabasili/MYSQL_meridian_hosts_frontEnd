import { useState, useEffect, useRef } from "react";
import axios from "axios";

const CountHotelsByCities = () => {
  const [loading, setLoading] = useState(true);
  const [hotelData, setHotelData] = useState();
  const runOnce = useRef(false)

  useEffect(() => {
    if (runOnce.current === false) {
      const displayData = async () => {
        setLoading(true);
        try {
          const resp = await axios.get("/hotels/countbycity");
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
          {hotelData.map((city) => (    
            <div key={city._id}>
              <h5><span style={{"text-transform": "capitalize"}}>{city._id}</span></h5>
              <p>{city.numberOfHotels} {city.numberOfHotels == 1 ? 'property' : 'properties'}</p>
              <br />
            </div>    
          ))}
        </>
      )}
    </div>
  );
};

export default CountHotelsByCities;
