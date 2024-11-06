import React, { PropsWithChildren } from 'react';
import Navbar from './Navbar';
const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
export default Layout;
