/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  Forwarder,
  ForwarderInterface,
} from "../../DelegatedEcexutorV1.sol/Forwarder";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_chainID",
        type: "uint256",
      },
    ],
    name: "domainSeperator",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sigChainID",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "chainID",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Forwarder.Request",
        name: "req",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "gas",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "nonce",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "sigChainID",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "chainID",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes",
          },
        ],
        internalType: "struct Forwarder.Request",
        name: "req",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "signature",
        type: "bytes",
      },
    ],
    name: "verify",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50610a82806100206000396000f3fe60806040526004361061003f5760003560e01c8063252f5a17146100445780632d0335ab14610077578063b0565b27146100ad578063cd74662f146100dd575b600080fd5b34801561005057600080fd5b5061006461005f3660046107f3565b6100f2565b6040519081526020015b60405180910390f35b34801561008357600080fd5b5061006461009236600461080c565b6001600160a01b031660009081526020819052604090205490565b3480156100b957600080fd5b506100cd6100c836600461083c565b6101d2565b604051901515815260200161006e565b6100f06100eb36600461083c565b6103be565b005b604080518082018252601381527221b937b9b9b1b0b430b4b72337b93bb0b232b960691b602091820152815180830183526005815264302e302e3160d81b9082015281517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818301527f6ea48a83ac1d927e37e3cf70de564f543263bb0aa606335c084f2c70cb1edb65818401527fae209a0b48f21c054280f2455d32cf309387644879d9acbd8ffc199163811885606082015260808101939093523060a0808501919091528251808503909101815260c0909301909152815191012090565b60008061034484848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061033e92507f47c6c6a0e234a33194b3cd8281cfa067caa773c4e6289cde4021b95f03b8dc669150610242905060208a018a61080c565b61025260408b0160208c0161080c565b8a604001358b606001358c608001358d60c001358e60a001358f8060e0019061027b91906108dc565b604051610289929190610923565b60408051918290038220602083019a909a526001600160a01b0398891690820152969095166060870152608086019390935260a085019190915260c084015260e083015261010082015261012081019190915261014001604051602081830303815290604052805190602001206103038960a001356100f2565b6040805161190160f01b6020808301919091526022820193909352604280820194909452815180820390940184526062019052815191012090565b90610574565b90508460c001354614801561038c57506080850135600080610369602089018961080c565b6001600160a01b03166001600160a01b0316815260200190815260200160002054145b80156103b557506103a0602086018661080c565b6001600160a01b0316816001600160a01b0316145b95945050505050565b6103c98383836101d2565b6104355760405162461bcd60e51b815260206004820152603260248201527f4d696e696d616c466f727761726465723a207369676e617475726520646f6573604482015271081b9bdd081b585d18da081c995c5d595cdd60721b60648201526084015b60405180910390fd5b61044460808401356001610933565b600080610454602087018761080c565b6001600160a01b03166001600160a01b031681526020019081526020016000208190555060008084602001602081019061048e919061080c565b6001600160a01b0316606086013560408701356104ae60e08901896108dc565b6104bb60208b018b61080c565b6040516020016104cd93929190610959565b60408051601f19818403018152908290526104e7916109af565b600060405180830381858888f193505050503d8060008114610525576040519150601f19603f3d011682016040523d82523d6000602084013e61052a565b606091505b509150915081819061054f5760405162461bcd60e51b815260040161042c91906109cb565b5061055f603f60608701356109fe565b5a1161056d5761056d610a20565b5050505050565b60008060006105838585610598565b91509150610590816105de565b509392505050565b6000808251604114156105cf5760208301516040840151606085015160001a6105c38782858561072f565b945094505050506105d7565b506000905060025b9250929050565b60008160048111156105f2576105f2610a36565b14156105fb5750565b600181600481111561060f5761060f610a36565b141561065d5760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161042c565b600281600481111561067157610671610a36565b14156106bf5760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161042c565b60038160048111156106d3576106d3610a36565b141561072c5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b606482015260840161042c565b50565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561076657506000905060036107ea565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa1580156107ba573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166107e3576000600192509250506107ea565b9150600090505b94509492505050565b60006020828403121561080557600080fd5b5035919050565b60006020828403121561081e57600080fd5b81356001600160a01b038116811461083557600080fd5b9392505050565b60008060006040848603121561085157600080fd5b833567ffffffffffffffff8082111561086957600080fd5b90850190610100828803121561087e57600080fd5b9093506020850135908082111561089457600080fd5b818601915086601f8301126108a857600080fd5b8135818111156108b757600080fd5b8760208285010111156108c957600080fd5b6020830194508093505050509250925092565b6000808335601e198436030181126108f357600080fd5b83018035915067ffffffffffffffff82111561090e57600080fd5b6020019150368190038213156105d757600080fd5b8183823760009101908152919050565b6000821982111561095457634e487b7160e01b600052601160045260246000fd5b500190565b8284823760609190911b6bffffffffffffffffffffffff19169101908152601401919050565b60005b8381101561099a578181015183820152602001610982565b838111156109a9576000848401525b50505050565b600082516109c181846020870161097f565b9190910192915050565b60208152600082518060208401526109ea81604085016020870161097f565b601f01601f19169190910160400192915050565b600082610a1b57634e487b7160e01b600052601260045260246000fd5b500490565b634e487b7160e01b600052600160045260246000fd5b634e487b7160e01b600052602160045260246000fdfea2646970667358221220638ab3898910e2ae020b727da068dc8c772a836737b3f0ce284cb34e89c2dd1464736f6c63430008090033";

type ForwarderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ForwarderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Forwarder__factory extends ContractFactory {
  constructor(...args: ForwarderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<Forwarder> {
    return super.deploy(overrides || {}) as Promise<Forwarder>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Forwarder {
    return super.attach(address) as Forwarder;
  }
  override connect(signer: Signer): Forwarder__factory {
    return super.connect(signer) as Forwarder__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ForwarderInterface {
    return new utils.Interface(_abi) as ForwarderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Forwarder {
    return new Contract(address, _abi, signerOrProvider) as Forwarder;
  }
}