import React, {useState, useEffect} from 'react'
import "./OverviewDataBlocks.css"
const OverviewDataBlocks = (props) => {
    const [para, setPara] = useState("");
    const [rupee, setRupee] = useState(false);
    useEffect(() => {
        const fetchStats = () => {
            if (props.type === "ordersToday") {
                setPara("Orders");
            } else if (props.type === "clientsToday") {
                setPara("Clients");
            } else if (props.type === "revenueToday") {
                setPara("Revenue");
                setRupee(true);
            }
        }
        fetchStats();
    }, []);

  return (
    <div className="small-numbers-div">
        
        <div className="small-numbers-text"><p>{para} Today</p>
            <span className="small-numbers-count">{rupee ? "Rs." : ""} {props.field}</span>
        </div>

        <div className="progress-ring-wrapper">
            <div className="progress-ring">
                <span></span>
            </div>
        </div>

    </div>
  )
}

export default OverviewDataBlocks