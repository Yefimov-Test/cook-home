export function generateMockId(): string {
  return `mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function simulatePayment(amountInCents: number): Promise<{
  success: boolean;
  paymentId: string;
  provider: "mock";
}> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    paymentId: generateMockId(),
    provider: "mock",
  };
}
