import React, {useState, useEffect} from "react";

const Loader = ({text, text2}) => {
  const [currText, setCurrText] = useState(text);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrText((prev) => (prev === text ? text2 : text));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {" "}
      <p className="text-2xl font-bold">{currText}...</p>{" "}
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
