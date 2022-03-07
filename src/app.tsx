import { QuerySample } from "./pages/QuerySample";
import { TxSample } from "./components/TxSample";
import { SignSample } from "./pages/SignSample";
import { SignBytesSample } from "./pages/SignBytesSample";
import React from "react";

import { ChakraProvider, CSSReset } from "@chakra-ui/react";
import Layout from "./components/Layout";
import Web from "./pages/Web";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import theme from "./theme";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import { Network } from "./pages/Network";

export default function App() {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Hydrate>
          <ChakraProvider theme={theme}>
            <CSSReset />

            <Layout>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Network />} />
                  <Route path="/query" element={<QuerySample />} />
                  <Route path="/web" element={<Web />} />
                </Routes>
              </BrowserRouter>
            </Layout>
          </ChakraProvider>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}
