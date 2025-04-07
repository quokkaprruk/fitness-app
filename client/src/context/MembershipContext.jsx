//added to make membership tier visible on home page while not calling backend directly

import React, { createContext, useState } from "react";
import PropTypes from "prop-types"; 

export const MembershipContext = createContext();

export const MembershipProvider = ({ children }) => {
  const [membership, setMembership] = useState("Basic");

  return (
    <MembershipContext.Provider value={{ membership, setMembership }}>
      {children}
    </MembershipContext.Provider>
  );
};

MembershipProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
