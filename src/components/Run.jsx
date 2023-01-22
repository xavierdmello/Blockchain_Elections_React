import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useProvider, usePrepareContractWrite, useContractWrite } from "wagmi";
import eAbi from "../abi/eAbi";
import "../styles/Run.css";

export default function Run({ election }) {
  const [name, setName] = useState("");
  const [candidateFee, setCandidateFee] = useState(ethers.utils.parseEther("0.05"));
  const provider = useProvider();
  const electionContract = new ethers.Contract(election.election, eAbi, provider);

  useEffect(() => {
    async function load() {
      setCandidateFee(await electionContract.candidateFee());
    }
    load();
  }, [election]);

  const { config, error } = usePrepareContractWrite({
    address: election.election,
    abi: eAbi,
    functionName: "runForElection",
    args: [name],
    overrides: {
      value: candidateFee,
    },
    chainId: 43113,
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div className="Run">
      <h1 className="electionTitle">{election.name}</h1>

      <div className="voteRow">
        <p>Enter your name:</p>
        <input placeholder="John Doe" type="text" onChange={(event) => setName(event.target.value)} value={name} />
        <button onClick={write}>Run For Office</button>
      </div>
    </div>
  );
}
