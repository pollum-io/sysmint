import { useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import Home from "./routes/Home";
import Dashboard from "./routes/Dashboard";
import CreateNFT from "./routes/CreateNFT";
import CreateSPT from "./routes/CreateSPT";
import IssueSPT from "./routes/IssueSPT";
import Update from "./routes/Update";
import Transfer from "./routes/Transfer";
import About from "./routes/About";

import Header from "./components/Header";
import store from "./state/store";
import { setupState } from "./utils/setupState";

import { setController, setIsInstalled } from "./state/wallet";

const App = () => {
  const [isLoading, setIsloading] = useState(true);
  const [componentIsConnected, setComponentIsConnected] = useState(false);
  const [walletLocked, setWalletLocked] = useState(false);

  window.onload = async () => {
    const { connected, isLocked } = store.getState();
    let controller = null;
    let isInstalled = false;
    if (typeof window.pali !== "undefined") {
      console.log("Pali is installed!");
      controller = window.pali;
      isInstalled = true;
      store.dispatch(setIsInstalled(true));
      store.dispatch(setController(window.pali));
    }
    connected && setComponentIsConnected(connected);
    setWalletLocked(isLocked);
    setIsloading(!isLoading);

    setupState();

    if (isInstalled && controller !== null) {
      //TODO: listen to the chainChanged and lockStateChanged events for doing alterations

      setWalletLocked(isLocked);
      setComponentIsConnected(connected);
    }
  };

  store.subscribe(async () => {
    const { connected, isLocked } = store.getState();

    connected !== componentIsConnected && setComponentIsConnected(connected);
    isLocked !== walletLocked && setWalletLocked(isLocked);
  });

  return (
    <div className="content">
      <BrowserRouter>
        <Provider store={store}>
          {isLoading ? (
            <></>
          ) : (
            <>
              <Header />
              <Switch>
                <Route path="/about" component={About} />
                <Route
                  path="/"
                  exact
                  component={
                    !store.getState().connected || store.getState().isLocked
                      ? Home
                      : Dashboard
                  }
                />
                {store.getState().connected && !store.getState().isLocked ? (
                  <Switch>
                    <Route path="/create-nft" component={CreateNFT} />
                    <Route path="/create-spt" component={CreateSPT} />
                    <Route path="/issue-spt" component={IssueSPT} />
                    <Route path="/update" component={Update} />
                    <Route path="/transfer" component={Transfer} />
                  </Switch>
                ) : (
                  <Redirect to="/" />
                )}
              </Switch>
            </>
          )}
        </Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
