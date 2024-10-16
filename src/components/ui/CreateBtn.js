import React from "react";
import Loader from "./Loader";

const CreateBtn = ({ onClick, loading, text }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-primary-pink hover:bg-primary-pink/90 duration-300 rounded-3xl justify-center items-center gap-3.5 inline-flex w-screen max-w-md md:max-w-lg py-5"
    >
      {loading ? (
        <div className="flex items-center justify-center w-full h-full">
          <Loader size={24} /> {/* Adjust size as needed */}
        </div>
      ) : (
        <span className="text-center text-white text-md">{text}</span>
      )}
    </button>
  );
};

export default CreateBtn;
