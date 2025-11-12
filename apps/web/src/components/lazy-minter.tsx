"use client";

import { getContract } from "thirdweb";
import { useState, useMemo } from "react";
import { client } from "@/lib/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { defineChain } from "thirdweb/chains";
import { useSendTransaction, useActiveAccount } from "thirdweb/react";
import { lazyMint } from "thirdweb/extensions/erc721";

interface LazyMinterProps {
  contractAddress: string;
}

const celoSepolia = defineChain({
  id: 11142220,
  name: "Celo Sepolia",
  rpc: "https://forno.celo-sepolia.celo-testnet.org",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  blockExplorers: [
    {
      name: "Celo Sepolia Blockscout",
      url: "https://celo-sepolia.blockscout.com",
    },
  ],
  testnet: true,
});

export function LazyMinter({ contractAddress }: LazyMinterProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [color, setColor] = useState("");
  const [raresa, setRaresa] = useState("");
  const [autor, setAutor] = useState("");
  const [isLazyMinting, setIsLazyMinting] = useState(false);

  const account = useActiveAccount();
  const { mutate: sendTx, isPending } = useSendTransaction();

  // Memoize contract instance
  const contract = useMemo(
    () =>
      getContract({
        client,
        chain: celoSepolia,
        address: contractAddress,
      }),
    [contractAddress],
  );

  const handleLazyMint = async () => {
    if (!name || !description || !imageUrl) {
      alert("Please fill in all fields");
      return;
    }
    if (!account?.address) {
      alert("Connect your wallet first");
      return;
    }
    
    setIsLazyMinting(true);
    
    try {
      const transaction = lazyMint({
        contract,
        nfts: [
          {
            name: name,
            description: description,
            image: imageUrl,
            attributes: [
              {
                trait_type: "Color",
                value: color,
              },
              {
                trait_type: "Raresa",
                value: raresa,
              },
              {
                trait_type: "Autor",
                value: autor,
              },
            ],
          },
        ],
      });
      
      await sendTx(transaction, {
        onSuccess: (result) => {
          console.log("Lazy mint transaction successful:", result);
          setName("");
          setDescription("");
          setImageUrl("");
          alert("NFTs lazy minted successfully!");
          setIsLazyMinting(false);
        },
        onError: (error) => {
          console.error("Lazy mint transaction failed:", error);
          alert("Error lazy minting NFTs. Please try again.");
          setIsLazyMinting(false);
        },
      });
    } catch (error: any) {
      console.error("Unexpected error:", error);
      alert("Unexpected error occurred. Please try again.");
      setIsLazyMinting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Lazy Mint NFTs</CardTitle>
        <p className="text-sm text-muted-foreground">
          Lazy minting allows you to create NFTs without immediately minting them to a specific address.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="NFT Name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-md h-20"
            placeholder="NFT Description"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="https://example.com/image.jpg"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Color</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Red"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Raresa</label>
          <input
            type="text"
            value={raresa}
            onChange={(e) => setRaresa(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Raresa"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Autor</label>
          <input
            type="text"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Autor"
          />
        </div>
        <Button
          onClick={handleLazyMint}
          disabled={isPending || isLazyMinting}
          className="w-full"
        >
          {isPending || isLazyMinting ? "Lazy Minting..." : "Lazy Mint NFT"}
        </Button>
      </CardContent>
    </Card>
  );
}
