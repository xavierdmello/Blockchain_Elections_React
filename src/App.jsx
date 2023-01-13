import { useEffect, useState } from "react";

import { ethers, BigNumber } from "ethers";
import "./styles/App.css";

import edaAbi from "./abi/edaAbi";
import emAbi from "./abi/emAbi";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main"

const B = BigNumber;

const emAddress = "0xC690ce62e557B7e7687DFb58945D49022851621A";
const edaAddress = "0x2A0B10368e69E35a330Fac7DeFcC9dC879e8B021";
const defaultRpc = "wss://ava-testnet.blastapi.io/dbc28275-1991-489a-9861-f346087ac3a9/ext/bc/C/ws";

function App() {
  const [account, setAccount] = useState();
  const [hasWeb3, setHasWeb3] = useState(window.ethereum ? true : false);
  const [election, setElection] = useState();

  let provider;
  if (hasWeb3) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = new ethers.providers.Web3Provider(new ethers.providers.WebSocketProvider(defaultRpc));
  }
  const eda = new ethers.Contract(edaAddress, edaAbi, provider);

  useEffect(() => {
    setHasWeb3(window.ethereum ? true : false);
  });

  // Set default election as the first one
  useEffect(() => {
    async function load() {
      const elections = await eda.getElectionsBundledWithNames(emAddress);
      setElection(elections[0].election);
    }
    load();
  }, []);

  function handleAccount(account) {
    setAccount(account);
  }

  function handleElection(electionAddress) {
    setElection(electionAddress);
  }

  function handleTx() {
    console.log("tx sent!");
  }

  return (
    <>
      <Header handleAccount={handleAccount} />
      <div className="split">
        <Sidebar eda={eda} emAddress={emAddress} handleElection={handleElection} />
        <hr />
        <Main election={election} eda={eda} afterTx={handleTx} />
      </div>
    </>
  );
}

export default App;
