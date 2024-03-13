import React, { useState } from "react";

const Tabs = ({ children }) => {
  const [openTab, setOpenTab] = useState(1);

  return (
    <>
      <div className="mx-3 my-12 flex flex-wrap lg:mx-12">
        <div className="w-full">
          <ul
            className="mb-0 flex list-none flex-row flex-wrap pb-4 pt-3"
            role="tablist"
          >
            {React.Children.map(children, (child, index) => (
              <li
                className="-mb-px mr-2 flex-auto text-center last:mr-0"
                key={index}
              >
                <a
                  className={
                    "block rounded px-5 py-3 text-xs font-bold uppercase leading-normal shadow-lg " +
                    (openTab === index + 1
                      ? "bg-custom2 text-white"
                      : "bg-white text-custom2")
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
          <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded bg-white shadow-lg">
            <div className="flex-auto px-4 py-5">
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
