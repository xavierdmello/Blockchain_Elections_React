import React, { useEffect, useState } from "react";

import "../styles/Sidebar.css";

export default function Sidebar({ eda, emAddress, handleElection, handlePage }) {
  const [elections, setElections] = useState();
  let electionElements = [];

  useEffect(() => {
    async function load() {
      const elections = await eda.getElectionsBundledWithNames(emAddress);
      setElections(elections);
    }
    load();
  }, []);

  if (elections) {
    electionElements = elections.map((election) => {
      const { election: address, name } = election;

      return (
        <li key={address}>
          <button className="button glass grow" onClick={() => handleElection(election)}>
            {name}
          </button>
        </li>
      );
    });
  }

  return (
    <div className="Sidebar">
      <div className="sidebar-header">
        <h1>Elections</h1>
        <button className="sidebar-create" onClick={() => handlePage("create")}>+</button>
      </div>

      <ul>{electionElements}</ul>
    </div>
  );
}
