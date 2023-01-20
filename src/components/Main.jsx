import React, { useEffect } from "react";
import { useState } from "react";
import "../styles/Main.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import HoverAddress from "./HoverAddress";
import { smolBreakpoint } from "../useIsSmol";
export default function Main({ election, eda, handleVote, handleOffice }) {
  const [electionData, setElectionData] = useState();

  async function load() {
    const data = await eda.getElectionData(election);
    setElectionData(data);
  }

  useEffect(() => {
    if (election) {
      load();
    }
  }, [election]);




  let title = "";
  let tableData = [];
  if (electionData) {
    const { candidateFee, candidates, closed, electionEndTime, electionName, electionStartTime, owner, voters } = electionData;
    title = electionName;
    tableData = candidates.map((candidate) => {
      return {
        ...candidate,
        address: <HoverAddress address={candidate.candidateAddress} />,
        votes: candidate.votes.toNumber(),
        vote: (
          <button className="voteButton glass" onClick={() => handleVote(candidate.candidateAddress, load)}>
            Vote
          </button>
        ),
      };
    });
  }

  return (
    <div className="Main">
      <h1 className="electionTitle">{electionData && title}</h1>
      <DataTable className="electionData" value={tableData} responsiveLayout="stack" breakpoint={`${smolBreakpoint}px`}>
        <Column field="rank" header=""></Column>
        <Column field="name" header="Name"></Column>
        <Column field="votes" header="Votes"></Column>
        <Column field="address" header="Address"></Column>
        <Column field="vote"></Column>
      </DataTable>
    </div>
  );
}
