import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import "../styles/PriceTable.css";
import { fetchElectricityPrices } from "../services/electricityService";

function PriceTable() {
  const [prices, setPrices] = useState({ today: [], tomorrow: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPrices = async () => {
      try {
        const data = await fetchElectricityPrices();
        if (data) {
          setPrices(data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load electricity prices");
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
  }, []);

  if (loading)
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  if (error) return <div>{error}</div>;

  const PriceTableContent = ({ prices, title }) => (
    <div className="price-table">
      <h2>{title}</h2>
      <table>
        <thead>
          <tr>
            <th>Hour</th>
            <th>Price (EUR/MWh)</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((price) => (
            <tr key={price.hour}>
              <td>{`${String(price.hour).padStart(2, "0")}:00`}</td>
              <td>{price.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  PriceTableContent.propTypes = {
    prices: PropTypes.arrayOf(
      PropTypes.shape({
        hour: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
    title: PropTypes.string.isRequired,
  };

  return (
    <div className="tables-container">
      <PriceTableContent prices={prices.today} title="Today's Prices" />
      {prices.tomorrow && prices.tomorrow.length > 0 ? (
        <PriceTableContent prices={prices.tomorrow} title="Tomorrow's Prices" />
      ) : (
        <div className="price-table">
          <h2>Tomorrow&apos;s Prices</h2>
          <p>
            Tomorrow&apos;s prices are not yet available. They are typically
            published after 13:00 Finnish time (after the day-ahead market
            closes).
          </p>
        </div>
      )}
    </div>
  );
}

export default PriceTable;
