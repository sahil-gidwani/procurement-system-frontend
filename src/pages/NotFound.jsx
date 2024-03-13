import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="mt-8 flex justify-center">
      <div
        className="h-96 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif')`,
        }}
      >
        <div className="text-center">
          <h1 className="font-serif text-6xl text-gray-800">404</h1>
          <div className="pt-60">
            <h3 className="text-4xl text-gray-800">Looks like you're lost</h3>
            <p className="mt-4 text-2xl text-gray-600">
              The page you are looking for is not available!
            </p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-md bg-green-500 px-4 py-2 text-white shadow hover:bg-green-600"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
