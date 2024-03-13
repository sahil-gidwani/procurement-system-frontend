const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex space-x-2">
        <div className="h-5 w-5 bg-custom2 rounded-full transform scale-0 animate-chase"></div>
        <div className="h-5 w-5 bg-custom2 rounded-full transform scale-0 animate-chase"></div>
        <div className="h-5 w-5 bg-custom2 rounded-full transform scale-0 animate-chase"></div>
      </div>
      <div className="mt-5 text-center">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
        <p className="text-sm text-gray-500">
          We're getting things ready for you.
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
