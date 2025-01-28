import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-black p-4 text-center">
      <p>© {new Date().getFullYear()} Private Article Reader. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
