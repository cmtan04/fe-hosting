import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntdApp, ConfigProvider } from "antd";
import RouterWeb from "./router/Routers";
import { LoadingProvider } from "./providers/loadingProvider";
import { NotificationProvider } from "./providers/notificationProvider";
import { SocketProvider } from "./providers/SocketProvider";

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
            fontFamily: "Open Sans",
          },
        }}
      >
        <LoadingProvider>
          <SocketProvider>
            <NotificationProvider>
              <AntdApp>
                <RouterWeb />
              </AntdApp>
            </NotificationProvider>
          </SocketProvider>
        </LoadingProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
export default App;
