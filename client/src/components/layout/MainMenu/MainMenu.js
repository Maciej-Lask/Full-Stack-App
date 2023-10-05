import {
  Button,
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import { FaBars } from 'react-icons/fa';
import './MainMenu.scss';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const MainMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Navbar expand="md" className="animated fadeIn">
        <NavbarToggler className="position-absolute" onClick={toggle}>
          <FaBars />
        </NavbarToggler>
        <Collapse isOpen={isOpen} navbar>
          <Nav className="ms-auto align-items-center" navbar>
            <NavItem>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            {!user ? ( // Check if the user is not logged in
              <>
                <NavItem className="d-block d-xl-block">
                  <NavLink href="/sign-up">Sign Up</NavLink>
                </NavItem>
                <NavItem className="d-block d-xl-block">
                  <NavLink href="/sign-in">Sign In</NavLink>
                </NavItem>
              </>
            ) : (
              // User is logged in
              <>
                <NavItem className="d-block d-xl-block">
                  <NavLink href="/sign-out">Sign Out</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink href="/ad/add">
                    <Button className="btn-outline" outline color="success">
                      Post ad
                    </Button>
                  </NavLink>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default MainMenu;
