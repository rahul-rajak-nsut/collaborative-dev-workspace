import {useEffect , useState} from "react";
import api from "../services/api";
function HomePage() {
    const [health , setHealth]= useState(null);
    const [ error , setError]= useState(null);

    useEffect(()=>{
        api.get("/api/health")
        .then((res)=> setHealth(res.data))
        .catch(()=>setError("counld not reach backend"));
    }, []);
    //[] at the end (called the dependency array
    return ( 
        <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center">
      <div className="p-6 rounded-lg border border-gray-800">
        <h1 className="text-xl font-semibold mb-2">System Status</h1>
        {error && <p className="text-red-400">{error}</p>}
        {health && (
          <p className="text-green-400">
            API: {health.status} · DB: {health.db}
          </p>
        )}
      </div>
    </div>
    );
}

export default HomePage;
