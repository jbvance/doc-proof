// AT HOME - On Rinkeby export const DOCPROOF_ADDRESS = "0x5e63679e7d901bfd64041afe55d53e29ae687f26";
//Below is for at office - on Rinkeby
export const DOCPROOF_ADDRESS = "0x4585cc2b15eef6f486b48888109a4a2d3619719a";
export const DOCPROOF_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_fileHash",
        type: "string"
      },
      {
        name: "_fileName",
        type: "string"
      },
      {
        name: "_lastModified",
        type: "uint256"
      }
    ],
    name: "registerFile",
    outputs: [
      {
        name: "success",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "fileHash",
        type: "string"
      },
      {
        indexed: true,
        name: "fileIndex",
        type: "uint256"
      }
    ],
    name: "FileRegistered",
    type: "event"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_fileHash",
        type: "string"
      }
    ],
    name: "checkFileExists",
    outputs: [
      {
        name: "fileExists",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "currentFileIndex",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    name: "fileMap",
    outputs: [
      {
        name: "creator",
        type: "address"
      },
      {
        name: "fileHash",
        type: "string"
      },
      {
        name: "timestamp",
        type: "uint256"
      },
      {
        name: "fileName",
        type: "string"
      },
      {
        name: "lastModified",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_index",
        type: "uint256"
      }
    ],
    name: "getFile",
    outputs: [
      {
        name: "creator",
        type: "address"
      },
      {
        name: "fileHash",
        type: "string"
      },
      {
        name: "timestamp",
        type: "uint256"
      },
      {
        name: "fileName",
        type: "string"
      },
      {
        name: "lastModified",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_fileHash",
        type: "string"
      }
    ],
    name: "getFileByFileHash",
    outputs: [
      {
        name: "creator",
        type: "address"
      },
      {
        name: "fileHash",
        type: "string"
      },
      {
        name: "timestamp",
        type: "uint256"
      },
      {
        name: "fileName",
        type: "string"
      },
      {
        name: "lastModified",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_fileHash",
        type: "string"
      }
    ],
    name: "getFileIndexByFileHash",
    outputs: [
      {
        name: "index",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_user",
        type: "address"
      },
      {
        name: "_userFileIndex",
        type: "uint256"
      }
    ],
    name: "getUserFiles",
    outputs: [
      {
        name: "creator",
        type: "address"
      },
      {
        name: "fileHash",
        type: "string"
      },
      {
        name: "timestamp",
        type: "uint256"
      },
      {
        name: "fileName",
        type: "string"
      },
      {
        name: "lastModified",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_account",
        type: "address"
      }
    ],
    name: "getUserMap",
    outputs: [
      {
        name: "arr",
        type: "uint256[]"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "address"
      },
      {
        name: "",
        type: "uint256"
      }
    ],
    name: "userMap",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];
