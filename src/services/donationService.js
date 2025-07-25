import { useAccount, useReadContract, useWriteContract, useWaitForTransaction, useTransactionReceipt, useChainId } from 'wagmi';
import { parseEther, parseUnits, formatEther } from 'viem';
import { baseSepolia, sepolia } from 'viem/chains';
import bamDonationAbi from '../abi/BAMDonation.json';
import bamNftTrackerAbi from '../abi/BAMDonationNFTTracker.json';
import bamNftAbi from '../abi/BAMDonationNFT.json';
import erc20Abi from '../abi/IERC20.json';

// Contract addresses configuration
const CONTRACT_ADDRESSES = {
  [baseSepolia.id]: {
    BAM_DONATION_CONTRACT: '0x48EAc2465b4BfA6DEE4009C3D043A5FcCbE26545',
    BAM_NFT_TRACKER_CONTRACT: '0x24690A3f62633C45E4473120F5227741E8689f6c',
    BAM_NFT_CONTRACT: '0xbBb74709629B14539f705Fe1673567FC56CFe6C5',
  },
  [sepolia.id]: {
    BAM_DONATION_CONTRACT: '0x8A4143dfBeD35f34bbb9f3f95b8065932157a329',
    BAM_NFT_TRACKER_CONTRACT: '0xdFE7ece717f6ac1e50a8f4d80D9Ce842390F3DD0',
    BAM_NFT_CONTRACT: '0x9C66b0AD3c944793B437d5c72B052fb964e3d455',
  },
};

// Hook to get current network's contract addresses
export const useContractAddresses = () => {
  const chainId = useChainId();
  
  const addresses = CONTRACT_ADDRESSES[chainId];
  
  if (!addresses) {
    console.error(`Contract addresses not configured for chain ID: ${chainId}`);
    return {
      BAM_DONATION_CONTRACT: null,
      BAM_NFT_TRACKER_CONTRACT: null,
      BAM_NFT_CONTRACT: null,
      isSupported: false,
    };
  }
  
  return {
    ...addresses,
    isSupported: true,
  };
};

// Hook for native currency donation
export const useNativeDonation = (message = "") => {
  const { address } = useAccount();
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const makeDonation = (amountInEth) => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }
    
    if (!isSupported || !BAM_DONATION_CONTRACT) {
      console.error("Network not supported or contract address not found");
      return;
    }
    
    writeContract({
      address: BAM_DONATION_CONTRACT,
      abi: bamDonationAbi.abi,
      functionName: 'donate',
      args: [message],
      value: parseEther(amountInEth.toString()),
    });
  };
  
  return {
    makeDonation,
    isLoading: isPending || isTransactionLoading,
    isSuccess: isConfirmed,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    transactionHash: hash,
    isNetworkSupported: isSupported,
  };
};

// Hook for token donation
export const useTokenDonation = () => {
  const { address } = useAccount();
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const makeDonation = (tokenAddress, amount, decimals = 18, message = "") => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }
    
    if (!isSupported || !BAM_DONATION_CONTRACT) {
      console.error("Network not supported or contract address not found");
      return;
    }
    
    const tokenAmount = parseUnits(amount.toString(), decimals);
    
    writeContract({
      address: BAM_DONATION_CONTRACT,
      abi: bamDonationAbi.abi,
      functionName: 'donateToken',
      args: [tokenAddress, tokenAmount, message],
    });
  };
  
  return {
    makeDonation,
    isLoading: isPending || isTransactionLoading,
    isSuccess: isConfirmed,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    transactionHash: hash,
    isNetworkSupported: isSupported,
  };
};

// Hook to approve token spending
export const useTokenApproval = () => {
  const { address } = useAccount();
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const approveToken = (tokenAddress, amount, decimals = 18) => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }
    
    if (!isSupported || !BAM_DONATION_CONTRACT) {
      console.error("Network not supported or contract address not found");
      return;
    }
    
    const tokenAmount = parseUnits(amount.toString(), decimals);
    
    writeContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'approve',
      args: [BAM_DONATION_CONTRACT, tokenAmount],
    });
  };
  
  return {
    approveToken,
    isLoading: isPending || isTransactionLoading,
    isSuccess: isConfirmed,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    transactionHash: hash,
    isNetworkSupported: isSupported,
  };
};

// Hook to check token allowance
export const useTokenAllowance = (tokenAddress, ownerAddress) => {
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: 'allowance',
    args: [ownerAddress, BAM_DONATION_CONTRACT],
    enabled: !!(tokenAddress && ownerAddress && isSupported && BAM_DONATION_CONTRACT),
  });
  
  return {
    allowance: data,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    refetch,
    isNetworkSupported: isSupported,
  };
};

// Hook to get all donations
export const useAllDonations = () => {
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error, refetch } = useReadContract({
    address: BAM_DONATION_CONTRACT,
    abi: bamDonationAbi.abi,
    functionName: 'getAllDonations',
    enabled: !!(isSupported && BAM_DONATION_CONTRACT),
  });
  
  return {
    donations: data,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    refetch,
    isNetworkSupported: isSupported,
  };
};

// Hook to get donations by donor
export const useDonationsByDonor = (donorAddress) => {
  const { BAM_NFT_TRACKER_CONTRACT, isSupported } = useContractAddresses();
  
  const { data: donationIndices, isLoading: indicesLoading } = useReadContract({
    address: BAM_NFT_TRACKER_CONTRACT,
    abi: bamNftTrackerAbi.abi,
    functionName: 'getDonationIndices',
    args: [donorAddress],
    enabled: !!(donorAddress && isSupported && BAM_NFT_TRACKER_CONTRACT),
  });

  const { donations: allDonations, isLoading: donationsLoading } = useAllDonations();

  const userDonations = donationIndices && allDonations 
    ? donationIndices.map(index => allDonations[Number(index)])
    : [];

  return {
    donations: userDonations,
    donationIndices: donationIndices || [],
    isLoading: indicesLoading || donationsLoading,
    isNetworkSupported: isSupported,
  };
};

// Hook to get contract native balance
export const useContractBalance = () => {
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_DONATION_CONTRACT,
    abi: bamDonationAbi.abi,
    functionName: 'getNativeBalance',
    enabled: !!(isSupported && BAM_DONATION_CONTRACT),
  });
  
  return {
    balance: data ? formatEther(data) : '0',
    balanceWei: data,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    isNetworkSupported: isSupported,
  };
};

// Hook to get token balance of contract
export const useContractTokenBalance = (tokenAddress) => {
  const { BAM_DONATION_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_DONATION_CONTRACT,
    abi: bamDonationAbi.abi,
    functionName: 'getTokenBalance',
    args: [tokenAddress],
    enabled: !!(tokenAddress && isSupported && BAM_DONATION_CONTRACT),
  });
  
  return {
    balance: data,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    isNetworkSupported: isSupported,
  };
};

// NFT-related hooks

// Hook to claim NFT for a donation
export const useClaimNFT = () => {
  const { address } = useAccount();
  const { BAM_NFT_TRACKER_CONTRACT, isSupported } = useContractAddresses();
  
  const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
  
  const { isLoading: isTransactionLoading, isSuccess: isConfirmed } = useTransactionReceipt({
    hash: hash,
  });
  
  const claimNFT = (donationIndex) => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }
    
    if (!isSupported || !BAM_NFT_TRACKER_CONTRACT) {
      console.error("Network not supported or contract address not found");
      return;
    }
    
    writeContract({
      address: BAM_NFT_TRACKER_CONTRACT,
      abi: bamNftTrackerAbi.abi,
      functionName: 'claimNFT',
      args: [donationIndex],
    });
  };
  
  return {
    claimNFT,
    isLoading: isPending || isTransactionLoading,
    isSuccess: isConfirmed,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    transactionHash: hash,
    isNetworkSupported: isSupported,
  };
};

// Hook to check if user has received NFT
export const useHasReceivedNFT = (userAddress) => {
  const { BAM_NFT_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_NFT_CONTRACT,
    abi: bamNftAbi.abi,
    functionName: 'hasReceivedNFT',
    args: [userAddress],
    enabled: !!(userAddress && isSupported && BAM_NFT_CONTRACT),
  });
  
  return {
    hasReceivedNFT: data || false,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    isNetworkSupported: isSupported,
  };
};

// Hook to check if donation has been claimed for NFT
export const useIsDonationClaimed = (donationIndex) => {
  const { BAM_NFT_TRACKER_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_NFT_TRACKER_CONTRACT,
    abi: bamNftTrackerAbi.abi,
    functionName: 'isDonationClaimed',
    args: [donationIndex],
    enabled: !!(donationIndex !== undefined && isSupported && BAM_NFT_TRACKER_CONTRACT),
  });
  
  return {
    isClaimed: data || false,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    isNetworkSupported: isSupported,
  };
};

// Hook to get user's NFT balance
export const useUserNFTBalance = (userAddress) => {
  const { BAM_NFT_CONTRACT, isSupported } = useContractAddresses();
  
  const { data, isLoading, isError, error } = useReadContract({
    address: BAM_NFT_CONTRACT,
    abi: bamNftAbi.abi,
    functionName: 'balanceOf',
    args: [userAddress],
    enabled: !!(userAddress && isSupported && BAM_NFT_CONTRACT),
  });
  
  return {
    balance: data ? Number(data) : 0,
    isLoading,
    isError: isError || !isSupported,
    error: !isSupported ? new Error('Network not supported') : error,
    isNetworkSupported: isSupported,
  };
};

// Helper function to format donation data
export const formatDonation = (donation) => {
  if (!donation) return null;
  
  return {
    donor: donation.donor,
    amount: donation.amount,
    formattedAmount: donation.assetType === 0 
      ? formatEther(donation.amount) 
      : donation.amount.toString(),
    timestamp: new Date(Number(donation.timestamp) * 1000),
    message: donation.message,
    tokenAddress: donation.tokenAddress,
    assetType: donation.assetType, // 0 = NATIVE, 1 = TOKEN
    isNative: donation.assetType === 0,
    isToken: donation.assetType === 1
  };
};

// Utility functions
export const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Helper hook to get current network info
export const useNetworkInfo = () => {
  const chainId = useChainId();
  const { isSupported } = useContractAddresses();
  
  const getNetworkName = (chainId) => {
    switch (chainId) {
      case baseSepolia.id:
        return 'Base Sepolia';
      case sepolia.id:
        return 'Ethereum Sepolia';
      default:
        return 'Unknown Network';
    }
  };
  
  return {
    chainId,
    networkName: getNetworkName(chainId),
    isSupported,
  };
};