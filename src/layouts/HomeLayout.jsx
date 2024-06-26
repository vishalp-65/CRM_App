import {
  Bars3Icon,
  ChevronDownIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon,
  PowerIcon,
  PresentationChartBarIcon,
  TicketIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Card,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { logout } from "../Redux/Slices/AuthSlice";
import { afterLogout } from "../Redux/Slices/TicketSlice";

function HomeLayout({ children }) {
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dashboardName, setDashboardName] = useState("Home");

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  function onLogout() {
    dispatch(logout());
    dispatch(afterLogout());
    navigate("/login");
  }

  useEffect(() => {
    console.log("dashboard name", dashboardName);
  }, [dashboardName]);

  useEffect(() => {
    if (!authState.isLoggedIn) navigate("/login");
  }, []);

  return (
    <>
      <div className="flex items-center justify-start shadow-md py-1 sticky top-0 bg-nvColor z-10 w-screen">
        <IconButton variant="text" size="lg" onClick={openDrawer}>
          {isDrawerOpen ? (
            <XMarkIcon className="h-8 w-8 stroke-2" />
          ) : (
            <Bars3Icon className="h-8 w-8 stroke-2" />
          )}
        </IconButton>
        <p className="text-2xl ml-4">{dashboardName}</p>
      </div>
      <Drawer open={isDrawerOpen} onClose={closeDrawer}>
        <Card
          color="transparent"
          shadow={false}
          className="h-[calc(100vh-2rem)] w-full p-3"
        >
          <div className="mb-2 flex items-center gap-4 p-4">
            <div className="flex items-baseline justify-start gap-2">
              <Typography
                variant="paragraph"
                className="text-xl"
                color="blue-gray"
              >
                Hi,
              </Typography>
              <Typography variant="h3" color="blue-gray">
                {authState?.data?.name}
              </Typography>
            </div>
          </div>
          <List>
            <Link to="/">
              <ListItem onClick={() => setDashboardName("Home")}>
                <ListItemPrefix>
                  <HomeIcon className="h-5 w-5" />
                </ListItemPrefix>
                Home
              </ListItem>
            </Link>
            <Link to="/dashboard">
              <ListItem onClick={() => setDashboardName("Dashboard")}>
                <ListItemPrefix>
                  <PresentationChartBarIcon className="h-5 w-5" />
                </ListItemPrefix>
                Dashboard
              </ListItem>
            </Link>

            <Accordion
              open={open === 1}
              icon={
                <ChevronDownIcon
                  strokeWidth={2.5}
                  className={`mx-auto h-4 w-4 transition-transform ${
                    open === 1 ? "rotate-180" : ""
                  }`}
                />
              }
            >
              <ListItem className="p-0" selected={open === 1}>
                <AccordionHeader
                  onClick={() => handleOpen(1)}
                  className="border-b-0 p-3"
                >
                  <ListItemPrefix>
                    <TicketIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  <Typography color="blue-gray" className="mr-auto font-normal">
                    Ticket
                  </Typography>
                </AccordionHeader>
              </ListItem>
              <AccordionBody className="py-1">
                <List className="p-0">
                  <Link to="/dashboard">
                    <ListItem onClick={() => setDashboardName("All Tickets")}>
                      <ListItemPrefix></ListItemPrefix>
                      All Tickets
                    </ListItem>
                  </Link>
                  <Link to="/ticket/create">
                    <ListItem
                      onClick={() => setDashboardName("Create new ticket")}
                    >
                      <ListItemPrefix></ListItemPrefix>
                      Create new ticket
                    </ListItem>
                  </Link>
                </List>
              </AccordionBody>
            </Accordion>

            {!authState.isLoggedIn ? (
              <Link to="/login">
                <ListItem>
                  <ListItemPrefix>
                    <PowerIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Log In
                </ListItem>
              </Link>
            ) : (
              <>
                {authState.role === "admin" && (
                  <li>
                    <Link to="/users">
                      <ListItem onClick={() => setDashboardName("All users")}>
                        <ListItemPrefix>
                          <UserCircleIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        All Users
                      </ListItem>
                    </Link>
                  </li>
                )}

                <ListItem onClick={onLogout}>
                  <ListItemPrefix>
                    <PowerIcon className="h-5 w-5" />
                  </ListItemPrefix>
                  Log out
                </ListItem>
              </>
            )}
          </List>
        </Card>
      </Drawer>
      <div className="flex items-start justify-center">
        <div className="w-[90%]">{children}</div>
      </div>
    </>
  );
}

export default HomeLayout;
