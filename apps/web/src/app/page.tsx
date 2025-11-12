"use client"

import { useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NFTCollection } from "@/components/nft-collection";
import { LazyMinter } from "@/components/lazy-minter";

export default function Home() {
  const account = useActiveAccount();
  const [contractAddress, setContractAddress] = useState("");
  const [showCollection, setShowCollection] = useState(false);

  const handleViewCollection = () => {
    if (contractAddress) {
      setShowCollection(true);
    } else {
      alert("Please enter a contract address");
    }
  };

  return (
    <main className="flex-1">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to{" "}
            {account ? (
              <span className="text-primary">{account.address}</span>
            ) : (
              <span className="text-primary">ThirdwebNft</span>
            )}
          </h1>
          <p className="text-lg text-muted-foreground">
            View and mint NFTs on Celo Sepolia Testnet
          </p>
        </div>

        {account ? (
          <div className="space-y-8">
            {/* Contract Address Input */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Enter NFT Contract Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  className="w-full p-3 border rounded-md"
                  placeholder="0x..."
                />
                <Button onClick={handleViewCollection} className="w-full">
                  View Collection
                </Button>
              </CardContent>
            </Card>

            {/* NFT Collection and Minter */}
            {showCollection && contractAddress && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <LazyMinter contractAddress={contractAddress} />
                </div>
                <NFTCollection contractAddress={contractAddress} />
              </>
            )}

          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg mb-4">Please connect your wallet to continue</p>
          </div>
        )}
      </div>
    </main>
  );
}