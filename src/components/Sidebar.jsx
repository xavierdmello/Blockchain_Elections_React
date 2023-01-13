import React, { useEffect, useState } from "react";

import "../styles/Sidebar.css";

export default function Sidebar({ eda, emAddress, handleElection }) {
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
          <button onClick={() => handleElection(address)}>
            {name}
          </button>
        </li>
      );
    });
  }

  return (
    <div className="Sidebar">
      <h1>Elections</h1>
      <ul>{electionElements}</ul>
    </div>
  );
}
