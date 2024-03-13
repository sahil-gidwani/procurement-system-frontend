const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex space-x-2">
        <div className="h-5 w-5 scale-0 transform animate-chase rounded-full bg-custom2"></div>
        <div className="h-5 w-5 scale-0 transform animate-chase rounded-full bg-custom2"></div>
        <div className="h-5 w-5 scale-0 transform animate-chase rounded-full bg-custom2"></div>
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
