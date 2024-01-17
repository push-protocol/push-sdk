import React, {useState, useEffect} from "react";

const Loader = () => {
  const [breath, setBreath] = useState("Breathe in");

  useEffect(() => {
    const interval = setInterval(() => {
      setBreath((prevBreath) =>
        prevBreath === "Breathe in" ? "Breathe out" : "Breathe in"
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {" "}
      <p className="text-2xl font-bold">{breath}...</p>{" "}
      <div className="flex items-center justify-center my-[10px]">
        <span className="loading loading-ring loading-xs"></span>
        <span className="loading loading-ring loading-sm"></span>
        <span className="loading loading-ring loading-md"></span>
        <span className="loading loading-ring loading-lg"></span>
      </div>
    </div>
  );
};

export default Loader;
