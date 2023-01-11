import {
  setIsConnected,
  setIsLocked,
  setIsInstalled,
  updateConnectedAccountData,
} from "../state/wallet";
import store from '../state/store';

const setState = ({ isConnected, isLocked, accountData }) => {
  store.dispatch(setIsConnected(isConnected));
  store.dispatch(setIsLocked(isLocked));
  store.dispatch(
    updateConnectedAccountData(accountData)
  );
}

export const setupState = () => {
  let isLocked = true;

  if (window.pali) {
    const controller = window.pali;

    controller.isUnlocked().then((unlocked) => {
      isLocked = !unlocked;
    });

    store.dispatch(setIsInstalled(true));

    controller.request({method: 'wallet_getAccount', params: []}).then((account) => {
      if (account) {
        if (isLocked) {
          setState({
            isConnected: true,
            isLocked,
            accountData: {
              balance: account.balances.syscoin,
              connectedAccount: { ...account, assets: [] },
              connectedAccountAddress: account.address,
            }
          });

          return;
        }
        controller.request({method: 'wallet_getTokens', params: []}).then((holdings) => {
          setState({
            isConnected: true,
            isLocked,
            accountData: {
              balance: account.balances.syscoin,
              connectedAccount: { ...account, assets: holdings.syscoin },
              connectedAccountAddress: account.address,
            }
          });
        })

        return;
      }

      setState({
        isConnected: false,
        isLocked,
        accountData: {
          balance: 0,
          connectedAccount: null,
          connectedAccountAddress: "",
        }
      });
    })
  }
}