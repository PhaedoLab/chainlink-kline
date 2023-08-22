import { ethers } from "ethers";

const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

const polygonTestnet = `https://polygon-mumbai.g.alchemy.com/v2/0utNRL5hQZIiQPWqLvEsZyi4cAP42NcM`;
const polygonMainnet = "https://polygon-mainnet.g.alchemy.com/v2/uOIGkW4vPxip08yzAK0_EyS_5KdUsIQv";
const provider = new ethers.providers.JsonRpcProvider(polygonMainnet);

const addrBTC = "0xc907E116054Ad103354f2D350FD2514433D57F6f"; // BTC / USD
const addrETH = "0xF9680D99D6C9589e2a93a78A04A279e509205945"; // ETH / USD
const addrLINK = "0xd9FFdb71EbE7496cC440152d43986Aae0AB76665"; // LINK / USD
export const contractBTC = new ethers.Contract(addrBTC, aggregatorV3InterfaceABI, provider);
export const contractETH = new ethers.Contract(addrETH, aggregatorV3InterfaceABI, provider);
export const contractLINK = new ethers.Contract(addrLINK, aggregatorV3InterfaceABI, provider);

const addrXAU = "0x0C466540B2ee1a31b441671eac0ca886e051E410"; // XAU / USD
const addrEUR = "0x73366Fe0AA0Ded304479862808e02506FE556a98"; // EUR / USD
const addrGBP = "0x099a2540848573e94fb1Ca0Fa420b00acbBc845a"; // GBP / USD
const addrJPY = "0xD647a6fC9BC6402301583C91decC5989d8Bc382D"; // JPY / USD
export const contractXAU = new ethers.Contract(addrXAU, aggregatorV3InterfaceABI, provider);
export const contractEUR = new ethers.Contract(addrEUR, aggregatorV3InterfaceABI, provider);
export const contractGBP = new ethers.Contract(addrGBP, aggregatorV3InterfaceABI, provider);
export const contractJPY = new ethers.Contract(addrJPY, aggregatorV3InterfaceABI, provider);
