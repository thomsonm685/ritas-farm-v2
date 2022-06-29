import { Page, Stack } from "@shopify/polaris";

// import { Header } from "../components/Header";
// import { SideNav } from "../components/SideNav";
import HomePage from "../pages/HomePage";
import AdminPage from "../pages/AdminPage";

// import { SupportPage } from "../pages/SupportPage";
// import { SetupPage } from "../pages/SetupPage";

import { useState } from "react";

export function Layout({ user, triggerReloadUser }) {
  console.log("user oh:", user);

  const [currentPage, switchPage] = useState("home");

  return (
    <Page fullWidth>
      {/* <Header/> */}
      <Stack>
        <Stack vertical>
          {currentPage === "home" ? (
            <HomePage
              user={user}
              triggerReloadUser={triggerReloadUser}
              switchPage={switchPage}
            />
          ) : currentPage === "admin" ? (
            <AdminPage
              user={user}
              triggerReloadUser={triggerReloadUser}
              switchPage={switchPage}
            />
          ) : (
            ""
          )}
        </Stack>
      </Stack>
    </Page>
  );
}
