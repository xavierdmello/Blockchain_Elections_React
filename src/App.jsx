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
import Vote from "./components/Vote";
import Create from "./components/Create";
import Run from "./components/Run";
import Manage from "./components/Manage";
import { useSigner, useProvider } from "wagmi";
import useIsSmol, { smolBreakpoint } from "./useIsSmol";
import heroTop from "./assets/hero-top.jpg";

const emAddress = "0xC690ce62e557B7e7687DFb58945D49022851621A";
const edaAddress = "0x2A0B10368e69E35a330Fac7DeFcC9dC879e8B021";

function App() {

  const [election, setElection] = useState();
  const smol = useIsSmol();
  const [page, setPage] = useState("vote");

  const { data: signer, isError, isLoading } = useSigner();
  const provider = useProvider();

  const eda = new ethers.Contract(edaAddress, edaAbi, provider);


  // Set default election as the first one
  useEffect(() => {
    async function load() {
      const elections = await eda.getElectionsBundledWithNames(emAddress);
      setElection(elections[0]);
    }
    load();
  }, []);

  function handleElection(election) {
    setElection(election);
  }

  async function handleVote(who, callback) {
    const electionContract = new ethers.Contract(election.election, eAbi, signer);
    const tx = await electionContract.vote(who);
    await tx.wait(1);
    callback();
  }

  function handleClick(page) {
    setPage(page);
  }

  return (
    <div className="container">
      <img src={heroTop} className="heroTop" />
      <div className="App">
        <Header handleClick={handleClick} />
        <div className="split">
          <Sidebar eda={eda} emAddress={emAddress} handleElection={handleElection} handlePage={handleClick} />
          <hr />
          {page === "vote" && <Vote election={election} eda={eda} handleVote={handleVote} />}
          {page === "run" && <Run election={election} />}
          {page === "manage" && <Manage election={election} />}
          {page === "create" && <Create electionManager={emAddress} />}
        </div>
      </div>
    </div>
  );
}

export default App;
