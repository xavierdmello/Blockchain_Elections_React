import { useEffect, useState } from "react";

import { ethers, BigNumber } from "ethers";
import "./styles/App.css";

import edaAbi from "./abi/edaAbi";
import emAbi from "./abi/emAbi";
import eAbi from "./abi/eAbi";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; //icons
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import { useSigner, useProvider } from "wagmi";
import useIsSmol, {smolBreakpoint} from "./useIsSmol";

const emAddress = "0xC690ce62e557B7e7687DFb58945D49022851621A";
const edaAddress = "0x2A0B10368e69E35a330Fac7DeFcC9dC879e8B021";

function App() {
  const [hasWeb3, setHasWeb3] = useState(window.ethereum ? true : false);
  const [election, setElection] = useState();
  const smol = useIsSmol();


  const { data: signer, isError, isLoading } = useSigner();
  const provider = useProvider();

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

  function handleElection(electionAddress) {
    setElection(electionAddress);
  }

  async function handleVote(who, callback) {
    const electionContract = new ethers.Contract(election, eAbi, signer);
    const tx = await electionContract.vote(who);
    await tx.wait(1);
    callback();
  }

  async function handleOffice(callback) {
    const electionContract = new ethers.Contract(election, eAbi, signer);
    // TODO: remove placeholder name
    const tx = await electionContract.runForElection("John Doe", { value: ethers.utils.parseEther("0.05") });
    await tx.wait(1);
    callback();
  }

  return (
    <div className="App">
      <Header />
      <div className="split">
        <Sidebar eda={eda} emAddress={emAddress} handleElection={handleElection} />
        <hr />
        <Main election={election} eda={eda} handleVote={handleVote} handleOffice={handleOffice} />
      </div>
    </div>
  );
}

export default App;
