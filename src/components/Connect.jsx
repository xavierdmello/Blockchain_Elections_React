import { ethers } from "ethers";
import { useEffect } from "react";
import "../styles/Connect.css";
export default function Connect({ handleAccount, connectedAccount }) {
  const hasWeb3 = window.ethereum ? true : false;
  let provider;
  if (hasWeb3) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  }

  async function connect() {
    const accounts = await provider.send("eth_requestAccounts", []);

    handleAccountsChanged(accounts);
  }

  function handleAccountsChanged(accounts) {
    handleAccount({ singer: provider.getSigner(), address: accounts[0] });
  }

  // Update accounts whenever user switches accounts in wallet
  useEffect(() => {
    if (hasWeb3) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  });

  return (
    <div>
      {!hasWeb3 && <p>"Please download wallet"</p>}
      <button className="Connect glass button" onClick={hasWeb3 ? connect : undefined}>
        {connectedAccount ? `Connected: ${connectedAccount.address.slice(0, 5) + "..." + connectedAccount.address.slice(-5)}` : "Connect Wallet"}
      </button>
    </div>
  );
}
