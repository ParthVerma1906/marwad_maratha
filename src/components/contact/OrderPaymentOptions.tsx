
// This file is now only used as the PaymentOptionsProps type definition.
export interface PaymentOptionsProps {
  paymentMode: string;
  setPaymentMode: (value: string) => void;
  paymentDone: boolean;
  setPaymentDone: (value: boolean) => void;
  upiId: string;
  upiLink: string;
  qrUrl: string;
  processing: boolean;
}
