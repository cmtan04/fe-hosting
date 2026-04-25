import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider } from "antd";
import RouterWeb from "./router/Routers";
import { LoadingProvider } from "./providers/loadingProvider";
import { NotificationProvider } from "./providers/notificationProvider";
import { SocketProvider } from "./providers/SocketProvider";
import { AuthProvider } from "./common/contexts/authContext";
import { LoginRequiredModalProvider } from "./providers/loginRequiredModalProvider";

const App = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00293a",
            colorPrimaryActive: "#001c29",
            colorPrimaryHover: "#00609c",
            fontFamily: "Open Sans",
          },
        }}
      >
        <AuthProvider>
          <LoadingProvider>
            <SocketProvider>
              <NotificationProvider>
                <AntdApp>
                  <LoginRequiredModalProvider>
                    <RouterWeb />
                  </LoginRequiredModalProvider>
                </AntdApp>
              </NotificationProvider>
            </SocketProvider>
          </LoadingProvider>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
export default App;
