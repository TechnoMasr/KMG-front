import { Outlet, useLocation } from "react-router";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchSetting } from "@/store/setting/setting";
import { Toaster } from "@/components/ui/sonner";
import LogOutModal from "@/components/modals/LogOutModal";
import RequiredLoginModal from "@/components/modals/RequiredLoginModal";
import RequiredVerifyEmailModal from "@/components/modals/RequiredVerifyEmailModal";
import ContactUsModal from "./components/modals/ContactUsModal";
import AppInitializer from "./utils/AppInitializer";

function App() {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSetting());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main>
      <Header />

      <div className="min-h-[90vh]">
        <AppInitializer>
          <Outlet />
        </AppInitializer>
      </div>

      <Footer />

      <Toaster position="top-center" />

      {/* modals */}
      <LogOutModal />
      <RequiredLoginModal />
      <RequiredVerifyEmailModal />
      <ContactUsModal />
    </main>
  );
}

export default App;
