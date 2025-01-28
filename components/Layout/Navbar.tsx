import React from "react";
import Link from "next/link";
import { FiGithub } from "react-icons/fi";

const nav_items = [
  {
    id: 1,
    label: "Home",
    link: "/",
  },
  {
    id: 2,
    label: "Source Code",
    link: "https://github.com/huddle6/private-article-reader",
    icon: <FiGithub />,
  },
];

const Navbar = () => {
  return (
    <div className="navbar flex flex-col items-center gap-4 px-4 py-6 border-b-2 lg:flex-row lg:justify-between">
      <Link className="text-2xl font-bold" href="/">
        Private Article Reader
      </Link>
      <div className="flex gap-6">
        {nav_items.map((item) => (
          <Link
            href={item.link}
            key={item.id}
            className="flex items-center gap-2 text-lg"
          >
            {item.icon && <span>{item.icon}</span>}
            <span className="cursor-pointer hover:underline">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
