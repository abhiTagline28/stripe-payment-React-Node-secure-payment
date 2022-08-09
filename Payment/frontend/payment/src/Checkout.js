import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React from "react";
import "./Checkout.css";
import axios from "axios";

function Checkout() {
  const stripe = useStripe();
  const elements = useElements();

  const pay = async (id) => {
    console.log("id :>> ", id);
    try {
      const response = await fetch("http://localhost:5000/pay", {
        method: "POST",
        body: JSON.stringify({ customerId: id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const cardElement = elements.getElement(CardElement);
      const confirmPayment = await stripe.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card: cardElement } }
      );
      console.log(confirmPayment);
      const { paymentIntent } = confirmPayment;
      if (paymentIntent.status === "succeeded") alert(`Payment successful!`);
      else alert(`Payment failed!`);
    } catch (err) {
      console.error(err);
      alert("There was an error in payment");
    }
  };

  const createUserAndPay = async () => {
    axios
      .post("http://localhost:5000/create-user", {
        name: "abhi",
        email: "abhi@gmail.com",
      })
      .then((response) => {
        console.log("response :>> ", response);
        pay(response?.data?.data?.id);
        // axios.post("http://localhost:5000/pay", {
        //   customerId: response?.data?.data?.id,
        // });
      })
      .catch((error) => {
        console.log("error :>> ", error);
      });

    //   .fetch("http://localhost:5000/create-user", {
    //     method: "POST",
    //     body: JSON.stringify({ name: "abhi", email: "abhi@gmail.com" }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((response) => {
    //     console.log("response :>> ", response.json);
    //   })
    //   .catch((error) => {
    //     console.log("error :>> ", error);
    //   });
    // const data = await response.json();

    // console.log("data :>> ", data);
    // if (Object.keys(data).length) {
    //   pay(data.id);
    // }
  };

  return (
    <div className="checkout" style={{ width: "25%" }}>
      <CardElement />
      <button onClick={createUserAndPay}>Pay</button>
      {/* <button onClick={pay}>Pay</button> */}
    </div>
  );
}

export default Checkout;
