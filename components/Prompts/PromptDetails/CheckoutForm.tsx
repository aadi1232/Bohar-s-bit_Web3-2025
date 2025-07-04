import { newOrder } from "@/actions/orders/createOrder";
import { getUser } from "@/actions/user/getUser";
import { styles } from "@/utils/styles";
import {
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";

// This component is deprecated. All payments are handled via Web3 (ETH) only.
const CheckoutForm = ({
  setOpen,
  open,
  promptData,
}: {
  setOpen: (open: boolean) => void;
  open: boolean;
  promptData: any;
}) => {
  const [message, setMessage] = useState<any>("");
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userData = await getUser();
    if (!stripe || !elements) {
      return;
    }
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });
    if (error) {
      setMessage(error.message);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      await newOrder({
        userId: userData?.user?.id!,
        promptId: promptData.id,
        payment_id: paymentIntent.id,
        payment_method: paymentIntent.id!,
      }).then((res) => {
        setOpen(!open);
        window.location.reload();
      });
    }
  };

  return (
    <div className="w-full text-center p-10">
      <h2 className="text-2xl font-bold">Checkout</h2>
      <p className="mt-4">
        Payments are now handled via Web3 (ETH) only. Please use your crypto
        wallet to complete the purchase.
      </p>
    </div>
  );
};

export default CheckoutForm;
