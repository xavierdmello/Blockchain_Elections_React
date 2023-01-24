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
import { useNotification } from "@web3uikit/core";

const emAddress = "0xC690ce62e557B7e7687DFb58945D49022851621A";
const edaAddress = "0x2A0B10368e69E35a330Fac7DeFcC9dC879e8B021";

function App() {
  const [election, setElection] = useState();
  const [elections, setElections] = useState();
  const [electionData, setElectionData] = useState();
  const [page, setPage] = useState("vote");

  const provider = useProvider();
  const eda = new ethers.Contract(edaAddress, edaAbi, provider);
  const dispatch = useNotification();

  async function loadElectionData() {
    const data = await eda.getElectionData(election.election);
    setElectionData(data);
  }

  async function loadElections() {
    const elections = await eda.getElectionsBundledWithNames(emAddress);
    setElections(elections);
  }

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    election && loadElectionData();
  }, [election]);

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
      await callback();
      dispatch({
        type: "success",
        message: "Transaction Complete!",
        title: "Transaction Notification",
        position: "topR",
      });
    } catch (error) {
      dispatch({
        type: "error",
        message: "Transaction Error",
        title: "Transaction Notification",
        position: "topR",
      });
    }
  }

  return (
    <div className="container">
      <img src={heroTop} className="heroTop" />
      <div className="App">
        <Header handleClick={handlePage} />
        <div className="split">
          <Sidebar elections={elections} handleElection={handleElection} handlePage={handlePage} />
          <hr />
          {page === "vote" && <Vote election={election} electionData={electionData} handleSuccess={handleSuccess} callback={loadElectionData} />}
          {page === "run" && <Run election={election} electionData={electionData} handleSuccess={handleSuccess} callback={loadElectionData} />}
          {page === "manage" && <Manage election={election} electionData={electionData} handleSuccess={handleSuccess} />}
          {page === "create" && <Create electionManager={emAddress} handleSuccess={handleSuccess} callback={loadElections} />}
        </div>
      </div>
    </div>
  );
}

export default App;
