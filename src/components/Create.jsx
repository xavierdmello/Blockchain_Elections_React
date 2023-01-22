import { useEffect, useState } from "react";
import { useSigner, useProvider, usePrepareContractWrite, useContractWrite } from "wagmi";
import emAbi from "../abi/emAbi";
import "../styles/Create.css";

export default function Create({ electionManager }) {
  const [name, setName] = useState("");
  const [end, setEnd] = useState("");
  const { config, error } = usePrepareContractWrite({
    address: electionManager,
    abi: emAbi,
    functionName: "createElection",
    chainId: 43113,
    args: [name, unixTime(end)],
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  function unixTime(dateString) {
    const date = new Date(dateString);
    const timezoneOffset = date.getTimezoneOffset() * 60;
    return Math.floor(date.getTime() / 1000 + timezoneOffset);
  }

  return (
    <div className="Create">
      <div className="nameRow">
        <p>Election name: </p>
        <input type="text" value={name} onChange={(event) => setName(event.target.value)}></input>
      </div>
      <div className="nameRow">
        <p>End date: </p>
        <input type="date" onChange={(event) => setEnd(event.target.value)} value={end}></input>
      </div>
      <button onClick={write}>Create Election</button>
    </div>
  );
}
