import { ethers } from "ethers";
import { useEffect } from "react";
import "../styles/Connect.css"
export default function Connect({ handleAccount }) {
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
      <button className="Connect glass button grow" onClick={hasWeb3 ? connect: undefined}>
        Connect Wallet
      </button>
    </div>
  );
}
