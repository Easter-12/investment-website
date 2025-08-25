export default function ActivityPopup({ name, amount, plan }) {
  return (
    <div className="ticker-wrap">
      <div className="ticker-content">
        <div className="ticker-item">
          <span className="ticker-highlight">New Investment!</span> {name} just invested ${amount} in the {plan} Plan.
        </div>
      </div>
    </div>
  );
}