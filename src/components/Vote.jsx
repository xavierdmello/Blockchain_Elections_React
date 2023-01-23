import React from "react";
import "../styles/Vote.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import HoverAddress from "./HoverAddress";
import useIsSmol, { smolBreakpoint } from "../useIsSmol";
import { ethers } from "ethers";
import eAbi from "../abi/eAbi";
import { useSigner } from "wagmi";

export default function Vote({ election, electionData, handleSuccess, callback }) {
  const smol = useIsSmol();
  const { data: signer } = useSigner();

  let tableData = [];
  let candidateFee, candidates, closed, electionEndTime, electionName, electionStartTime, owner, voters;

  if (electionData) {
    ({ candidateFee, candidates, closed, electionEndTime, electionName, electionStartTime, owner, voters } = electionData);
    tableData = candidates.map((candidate) => {
      return {
        ...candidate,
        address: <HoverAddress address={candidate.candidateAddress} />,
        votes: candidate.votes.toNumber(),
        vote: (
          <button className="txButton glass" onClick={() => handleVote(candidate.candidateAddress)}>
            Vote
          </button>
        ),
      };
    });
  }

  async function handleVote(who) {
    const electionContract = new ethers.Contract(election.election, eAbi, signer);
    const tx = await electionContract.vote(who);
    handleSuccess(tx, callback);
  }

  let formattedStartTime, formattedEndTime;
  if (electionData) {
    formattedStartTime = new Date(electionStartTime.toNumber() * 1000).toLocaleString();
    formattedEndTime = new Date(electionEndTime.toNumber() * 1000).toLocaleString();
  }

  return (
    <div className="Vote">
      <h1 className="electionTitle">{election && `Vote: ${election.name}`}</h1>
      {!smol && (
        <p className="vote-dates">
          {formattedStartTime} - {formattedEndTime}
        </p>
      )}
      {smol && (
        <>
          <p className="vote-dates">Open: {formattedStartTime}</p>
          <p className="vote-dates">Close: {formattedEndTime}</p>
        </>
      )}
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
