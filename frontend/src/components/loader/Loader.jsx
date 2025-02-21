import { CirclesWithBar } from "react-loader-spinner";

const Loader = () => {
  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div>
          <CirclesWithBar
            height="100"
            width="100"
            color="#4fa94d"
            outerCircleColor="#4fa94d"
            innerCircleColor="#4fa94d"
            barColor="#4fa94d"
            ariaLabel="circles-with-bar-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      </div>
    </div>
  );
};
export default Loader;
