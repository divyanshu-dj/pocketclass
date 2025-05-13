import React, { useState } from "react";
import { AddressElement, PaymentElement } from "@stripe/react-stripe-js";

const BillingAddress = () => {
    const [isAddressReady, setIsAddressReady] = useState(false);
    const [isPaymentReady, setIsPaymentReady] = useState(false);

    const isElementsReady = isAddressReady && isPaymentReady;

    return (
        <div className="address-container">
            {!isElementsReady && (
                <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-black bg-opacity-50">
                    <div className="bg-white p-8 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto animate-pulse">
                        {/* Go Back Button Skeleton */}
                        <div className="flex flex-row justify-end text-gray-300 mb-2">
                            <div className="h-4 w-16 bg-gray-300 rounded"></div>
                        </div>

                        {/* Header Section Skeleton */}
                        <div className="flex flex-row items-center justify-between mb-4">
                            <div className="h-6 w-40 bg-gray-300 rounded"></div>
                            <div className="flex items-center">
                                <div className="h-4 w-20 bg-gray-300 rounded mr-2"></div>
                                <div className="h-4 w-12 bg-gray-300 rounded"></div>
                            </div>
                        </div>

                        {/* Address and Payment Skeletons */}
                        <div className="h-14 w-full bg-gray-300 rounded mb-4"></div>
                        <div className="h-14 w-full bg-gray-300 rounded mb-4"></div>
                        <div className="h-14 w-full bg-gray-300 rounded mb-4"></div>

                        {/* Pay Button Skeleton */}
                        <div className="mt-4 p-2 bg-gray-400 text-white rounded w-full text-center">
                            Processing...
                        </div>
                    </div>
                </div>
            )}

            {isElementsReady && (
                <div>
                    <AddressElement
                        options={{ mode: "billing" }}
                        onReady={() => setIsAddressReady(true)}
                    />
                    <div className="mt-4">
                        <PaymentElement
                            onReady={() => setIsPaymentReady(true)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BillingAddress;
