import { contractAddress, contractABI } from "../configs/contract"
import { createContext } from "react";

const ContextContractAddressABI = createContext( {
    addressOrName: contractAddress,
    contractInterface: contractABI
});

export default ContextContractAddressABI;