import "../styles/HoverAddress.css";
export default function HoverAddress({ address }) {
    return (
      <div className="HoverAddress">
        <p className="hoverBubble">{address}</p>
        <p className="shortAddress">{address.slice(0, 5) + "..." + address.slice(-5)}</p>
      </div>
    );
}