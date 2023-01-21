import { useEffect, useState } from "react";
import { useSigner, useProvider, usePrepareContractWrite, useContractWrite, useContractRead, useBalance } from "wagmi";
import eAbi from "../abi/eAbi";
import "../styles/Manage.css";

export default function Manage({ election }) {
  const { data: revenue } = useBalance({
    address: election.election,
    chainId: 43113,
  });

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
          Current Revenue: {revenue.formatted} {revenue.symbol}
        </p>

        <button onClick={write}>Withdraw Revenue</button>
      </div>
    </div>
  );
}
