"use client";

import { useEffect } from "react";
import CardListSection from "@/components/CardListSection";
import { useDataStates } from "@/lib/hooks/useDataStates";
import { DataStateRenderer } from "@/components/DataStateRenderer";

type Card = {
  id: string;
  type: "visa" | "mastercard" | "amex" | "rupay";
  lastFourDigits: string;
  expiryDate: string;
  cardholderName: string;
  bankName: string;
  availableCredit?: number;
  isActive: boolean;
  priority?: boolean;
};

export default function CardsClientPage() {
  const { data, isLoading, error, setData, setIsLoading, setError } =
    useDataStates<Card[]>();

  // Function to fetch cards data
  const fetchCards = async () => {
    try {
      setIsLoading(true);

      // In a real implementation, this would call your API
      const response = await fetch("/api/cards");
      if (!response.ok) {
        throw new Error(`Error fetching cards: ${response.statusText}`);
      }

      const cards = await response.json();
      setData(cards);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch cards"));
    } finally {
      setIsLoading(false);
    }
  };

  // Use effect to load data on component mount
  useEffect(() => {
    // For demo purposes, mock the data instead of making a real API call
    // In a real app, you would call fetchCards() here

    // Simulate loading time
    setIsLoading(true);

    // Mock data - replace with actual API call in production
    setTimeout(() => {
      const mockCards: Card[] = [
        {
          id: "1",
          type: "visa",
          lastFourDigits: "1234",
          expiryDate: "12/25",
          cardholderName: "John Doe",
          bankName: "Chase Bank",
          availableCredit: 5000,
          isActive: true,
          priority: true,
        },
        {
          id: "2",
          type: "mastercard",
          lastFourDigits: "5678",
          expiryDate: "03/26",
          cardholderName: "John Doe",
          bankName: "Bank of America",
          availableCredit: 3500,
          isActive: true,
          priority: false,
        },
        {
          id: "3",
          type: "amex",
          lastFourDigits: "9012",
          expiryDate: "09/24",
          cardholderName: "John Doe",
          bankName: "American Express",
          availableCredit: 10000,
          isActive: true,
          priority: false,
        },
      ];

      setData(mockCards);
      setIsLoading(false);
    }, 1500); // Simulate a 1.5s loading time
  }, [setData, setIsLoading, setError]);

  // Server action for retry
  async function retryFetchAction() {
    "use server";
    // This is a server action but we can't do anything here
    // The actual retry happens client-side
  }

  return (
    <section className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Your Cards</h1>
        </div>

        <div className="bg-white border border-gray-100 rounded-lg p-4">
          <DataStateRenderer
            data={data}
            isLoading={isLoading}
            error={error}
            onRetryAction={retryFetchAction}
            errorTitle="Could not load your cards"
            emptyMessage="You don't have any cards yet."
            loadingHeight="h-64"
          >
            {(cards) => (
              <CardListSection
                title="Payment Cards"
                cards={cards}
                animateCards
              />
            )}
          </DataStateRenderer>
        </div>

        {/* Client-side retry button */}
        {error && (
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              // In a real app, you would call fetchCards() here
              // For demo, simulate success on retry
              setTimeout(() => {
                const mockCards: Card[] = [
                  {
                    id: "1",
                    type: "visa",
                    lastFourDigits: "1234",
                    expiryDate: "12/25",
                    cardholderName: "John Doe",
                    bankName: "Chase Bank",
                    availableCredit: 5000,
                    isActive: true,
                    priority: true,
                  },
                ];
                setData(mockCards);
                setIsLoading(false);
              }, 1000);
            }}
            className="mt-4 px-4 py-2 bg-primary text-white rounded"
          >
            Retry Loading Cards
          </button>
        )}
      </div>
    </section>
  );
}
