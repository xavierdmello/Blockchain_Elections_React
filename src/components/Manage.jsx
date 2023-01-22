import { useEffect, useState } from "react";
import { useProvider, usePrepareContractWrite, useContractWrite } from "wagmi";
import eAbi from "../abi/eAbi";
import "../styles/Manage.css";
import {ethers} from "ethers"
export default function Manage({ election }) {
  const provider = useProvider();
  const [revenue, setRevenue] = useState("");

  useEffect(() => {
    async function load() {
      const rawRevenue = await provider.getBalance(election.election);
      setRevenue(ethers.utils.formatEther(rawRevenue));
    }
    load();
  }, [election]);

  const { config, error } = usePrepareContractWrite({
    address: election.election,
    abi: eAbi,
    functionName: "withdrawRevenue",
    chainId: 43113,
  });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return (
    <div className="Manage">
      <h1 className="electionTitle">{election.name}</h1>

      <div className="manageRow">
        <p>
          Current Revenue: {revenue} AVAX
        </p>

        <button onClick={write}>Withdraw Revenue</button>
      </div>
    </div>
  );
}
