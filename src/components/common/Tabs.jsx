import React, { useState } from "react";

const Tabs = ({ children }) => {
  const [openTab, setOpenTab] = useState(1);

  return (
    <>
      <div className="flex flex-wrap my-12 lg:mx-12 mx-3">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            {React.Children.map(children, (child, index) => (
              <li
                className="-mb-px mr-2 last:mr-0 flex-auto text-center"
                key={index}
              >
                <a
                  className={
                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                    (openTab === index + 1
                      ? "text-white bg-custom2"
                      : "text-custom2 bg-white")
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenTab(index + 1);
                  }}
                  data-toggle={`tab${index + 1}`}
                  href={`#link${index + 1}`}
                  role="tablist"
                >
                  {child.props.tabTitle}
                </a>
              </li>
            ))}
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                {React.Children.map(children, (child, index) => (
                  <div
                    className={openTab === index + 1 ? "block" : "hidden"}
                    id={`link${index + 1}`}
                    key={index}
                  >
                    {child}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;
