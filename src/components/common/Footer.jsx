import React from "react";
import { NavLink } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";

// const sections = [
//   {
//     title: "Solutions",
//     items: ["Marketing", "Analytics", "Commerce", "Data", "Cloud"],
//   },
//   {
//     title: "Support",
//     items: ["Pricing", "Documentation", "Guides", "API Status"],
//   },
//   {
//     title: "Company",
//     items: ["About", "Blog", "Jobs", "Press", "Partners"],
//   },
//   {
//     title: "Legal",
//     items: ["Claims", "Privacy", "Terms", "Policies", "Conditions"],
//   },
// ];

// const items = [
//   { name: "Facebook", icon: FaFacebook, link: "https://www.facebook.com/" },
//   { name: "Instagram", icon: FaInstagram, link: "https://www.instagram.com/" },
//   { name: "Twitter", icon: FaTwitter, link: "https://twitter.com/" },
//   { name: "Twitch", icon: FaTwitch, link: "https://www.twitch.tv/" },
//   { name: "Github", icon: FaGithub, link: "https://github.com/" },
//   { name: "Linkedin", icon: FaLinkedin, link: "https://www.linkedin.com/" },
// ];

const items = [
  { icon: FaLinkedin, link: "https://www.linkedin.com/in/sahil-gidwani/" },
  {
    icon: FaGithub,
    link: "https://github.com/sahil-gidwani/procurement-system-backend",
  },
  {
    icon: FaGithub,
    link: "https://github.com/sahil-gidwani/procurement-system-frontend",
  },
];

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <div className="w-full bg-custom1 px-4 text-gray-300">
      {/* <div className="max-w-[1240px] mx-auto grid grid-cols-2 md:grid-cols-6 border-b-2 border-gray-600 py-8">
        {sections.map((section, index) => (
          <div key={index}>
            <h6 className="font-bold uppercase pt-2">{section.title}</h6>
            <ul>
              {section.items.map((item, i) => (
                <li key={i} className="py-1 text-gray-500 hover:text-white">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="col-span-2 pt-8 md:pt-2">
          <p className="font-bold uppercase">Subscribe to our newsletter</p>
          <p className="py-4">
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <form className="flex flex-col sm:flex-row">
            <input
              className="w-full p-2 mr-4 rounded-md mb-4"
              type="email"
              placeholder="Enter email.."
            />
            <button className="p-2 mb-4">Subscribe</button>
          </form>
        </div>
      </div> */}

      <div className="mx-auto flex max-w-[1240px] flex-col justify-between px-4 py-2 text-center text-gray-300 sm:flex-row">
        <p className="py-4">
          {currentYear} ProcurEase, &copy; All rights reserved
        </p>
        <div className="flex justify-between pt-4 text-xl sm:w-[300px]">
          {items.map((x, index) => {
            return (
              <NavLink
                target="_blank"
                key={index}
                to={x.link}
                className="mx-2 hover:text-white"
              >
                {<x.icon />}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Footer;
