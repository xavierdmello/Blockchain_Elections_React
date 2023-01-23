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
  const [page, setPage] = useState("vote");

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
    if (page === "create") {
      setPage("vote");
    }

    setElection(election);
  }

  function handlePage(page) {
    setPage(page);
  }

  async function handleSuccess(tx, callback) {
    try {
      await tx.wait(1);
      callback();
      //handleNewNotification(tx);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container">
      <img src={heroTop} className="heroTop" />
      <div className="App">
        <Header handleClick={handlePage} />
        <div className="split">
          <Sidebar eda={eda} emAddress={emAddress} handleElection={handleElection} handlePage={handlePage} />
          <hr />
          {page === "vote" && <Vote election={election} eda={eda} handleSuccess={handleSuccess} />}
          {page === "run" && <Run election={election} eda={eda} handleSuccess={handleSuccess} />}
          {page === "manage" && <Manage election={election} handleSuccess={handleSuccess} />}
          {page === "create" && <Create electionManager={emAddress} handleSuccess={handleSuccess} />}
        </div>
      </div>
    </div>
  );
}

export default App;
