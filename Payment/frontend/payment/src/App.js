import "./App.css";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Checkout from "./Checkout";

const stripePromise = loadStripe(
  "pk_test_51LUNeWSD1Kondtmsa5czhMFieFBPnSizgrqOv271LLhlYoIhozsKXFBs28vQmtJ8ulFxvySdGku5N03tU5MifIE100yb6dKuZ8"
);

function App() {
  return (
    <div className="app">
      <Elements stripe={stripePromise}>
        <Checkout />
      </Elements>
    </div>
  );
}

export default App;
