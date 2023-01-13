import { useEffect, useState } from "react";

import { ethers, BigNumber } from "ethers";
import "./styles/App.css";

import edaAbi from "./abi/edaAbi";
import emAbi from "./abi/emAbi";
import eAbi from "./abi/eAbi";
import "primereact/resources/themes/lara-light-indigo/theme.css"; 
import "primereact/resources/primereact.min.css";                
import "primeicons/primeicons.css";                                //icons
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main"

const B = BigNumber;

const emAddress = "0xC690ce62e557B7e7687DFb58945D49022851621A";
const edaAddress = "0x2A0B10368e69E35a330Fac7DeFcC9dC879e8B021";
const backupRpc = "https://api.avax-test.network/ext/bc/C/rpc";

function App() {
  const [account, setAccount] = useState();
  const [hasWeb3, setHasWeb3] = useState(window.ethereum ? true : false);
  const [election, setElection] = useState();

  let provider;
  if (hasWeb3 && account) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
  } else {
    provider = new ethers.providers.JsonRpcProvider(backupRpc);
  }
  console.log(provider)

  const eda = new ethers.Contract(edaAddress, edaAbi, provider);

  useEffect(() => {
    setHasWeb3(window.ethereum ? true : false);
  });


  // Set default election as the first one
  useEffect(() => {
    async function load() {
      const elections = await eda.getElectionsBundledWithNames(emAddress);
      setElection((elections[0].election));
    }
    load();
  }, []);

  function handleAccount(account) {
    setAccount(account);
  }

  function handleElection(electionAddress) {
    setElection(electionAddress);
  }

  async function handleVote(who, callback) {
    if (account) {
      const electionContract = new ethers.Contract(election, eAbi, provider.getSigner());
      const tx = await electionContract.vote(who)
      await tx.wait(1);
      callback()
    } else {
      console.log("Please connect your wallet first.")
    }
  }

  return (
    <div className="App">
      <Header handleAccount={handleAccount} connectedAccount={account} />
      <div className="split">
        <Sidebar eda={eda} emAddress={emAddress} handleElection={handleElection} />
        <hr />
        <Main election={election} eda={eda} handleVote={handleVote} />
      </div>
    </div>
  );
}

export default App;
