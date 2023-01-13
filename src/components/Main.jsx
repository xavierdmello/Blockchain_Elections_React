import React, { useEffect } from "react";
import { useState } from "react";
import "../styles/Main.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
export default function Main({ election, eda, afterTx }) {
  const [electionData, setElectionData] = useState();

  useEffect(() => {
    async function load() {
      const data = await eda.getElectionData(election);
      setElectionData(data);
    }
    if (election) {
      load();
    }
  }, [election]);
  
  let title =""
  let tableData = []
  if (electionData) {
    const { candidateFee, candidates, closed, electionEndTime, electionName, electionStartTime, owner, voters } = electionData;
    title = electionName
    tableData = candidates.map(candidate => {
      return {
        ...candidate,
        votes: candidate.votes.toNumber()
      };
    })
  }
  return (
    <div className="Main">
      <h1>{electionData && title}</h1>
      <DataTable value={tableData}>
        {/* <Column field="rank" header="Rank"></Column> */}
        <Column field="name" header="Name"></Column>
        <Column field="votes" header="Votes"></Column>
        <Column field="candidateAddress" header="Address"></Column>
        {/* <Column field="vote" header="Vote"></Column> */}
      </DataTable>
    </div>
  );
}
