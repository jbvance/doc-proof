pragma solidity ^0.5.0;

import "./SafeMath.sol";

/** @title File Registry. */
contract DocProof {
    using SafeMath for uint;

    // Structs
    struct File {
        address   creator;
        string    fileHash;
        uint      timestamp;
        string fileName;
        uint lastModified;
        
    }

    // Other Constants
    uint public currentFileIndex;
    address public owner;


    // mapping of file index to file
    // FILE INDEX || FILE
    mapping(uint => File)           public fileMap;

    // mapping of user addresses to an array of files
    // ADDRESS USER || Array of file indices
    mapping(address => uint[])      public userMap;

    // mapping of file hash to its file index
    // not public because public accessor of dynamically sized mapping is not yet built
    // STRING FILEHASH || UINT FILE INDEX
    mapping(string => uint)         fileHashMap;

    // Events
    event FileRegistered(string indexed fileHash, uint indexed fileIndex);

    constructor() public {
        currentFileIndex = 1;
        owner = msg.sender;
    }

    /** @dev Registers an IPFS file hash to contract.
    * @param _fileHash the IPFS file hash to register.
    * @return boolean if successful transaction.
    */
    function registerFile(string memory _fileHash, string memory _fileName, uint _lastModified) public returns (bool success) {
        // The same file cannot be registered twice
        require(fileHashMap[_fileHash] == 0, "That file has already been registered.");

        fileMap[currentFileIndex] = File(msg.sender, _fileHash, now, _fileName, _lastModified);
        userMap[msg.sender].push(currentFileIndex);
        fileHashMap[_fileHash] = currentFileIndex;
        currentFileIndex = currentFileIndex.add(1);

        emit FileRegistered(_fileHash, currentFileIndex.sub(1));
        return true;
    }

    /** @dev Returns all file info given file index in fileMap.
    * @param _index - index of registered file in fileMap.
    * @return creator The address of file creator.
    * @return fileHash The file IPFS hash.
    * @return timestamp The timestamp of file registry saved in blockchain.
    */
    function getFile(uint _index) public view returns (
        address          creator,
        string memory    fileHash,
        uint             timestamp,
        string memory    fileName,
        uint             lastModified
    ) {
        require(_index > 0, "Provided index must be greater than zero");
        File memory f = fileMap[_index];
        return (f.creator, f.fileHash, f.timestamp, f.fileName, f.lastModified);
    }

    /** @dev Returns all file info given file creator and index of file in user's file array
    * @param _user Address of file creator.
    * @param _userFileIndex - Index of registered file in user's file array.
    * @return creator The address of file creator.
    * @return fileHash The file IPFS hash.
    * @return timestamp The timestamp of file registry saved in blockchain.
    */
    function getUserFiles(address _user, uint _userFileIndex) public view returns (
        address          creator,
        string memory    fileHash,
        uint            timestamp,
        string memory   fileName,
        uint            lastModified
    ) {       
        require(_userFileIndex <= userMap[_user].length.sub(1), "User index must not be greater than length of user file array");
        return getFile(userMap[_user][_userFileIndex]);
    }

    /** @dev Shortcut function to check if a fileHash exists in registry.
    * @param _fileHash the IPFS file hash to register.
    * @return boolean if file exists.
    */
    function checkFileExists(string memory _fileHash) public view returns (bool fileExists) {
        fileExists = fileHashMap[_fileHash] > 0;
    }

    /** @dev Shortcut function to read a file's index by its hash.
    * @param _fileHash the IPFS file hash to register.
    * @return uint index.
    */
    function getFileIndexByFileHash(string memory _fileHash) public view returns (uint index) {
        return fileHashMap[_fileHash];
    }

    /** @dev Shortcut function to read a file info with fileHash.
    * @param _fileHash the IPFS file hash to register.
    * @return creator The address of file creator.
    * @return fileHash The file IPFS hash.
    * @return timestamp The timestamp of file registry saved in blockchain.
    */
    function getFileByFileHash(string memory _fileHash) public view returns (
    address          creator,
    string memory    fileHash,
    uint             timestamp,
    string memory    fileName,
    uint             lastModified
    ) {
        return getFile(getFileIndexByFileHash(_fileHash));
    }

    /** @dev shortcut function to return array of file indices for an account
    *   Currently, to call userMap getter, you must call with an index, so it's
    *   not possible to get all indices in userMap array by calling the getter directly
    *   @param _account - The account for which to get the array
    *   @return arr the array of file indices for lookup in fileMap
    */ 
    function getUserMap(address _account) public view returns (uint[] memory arr) {
        return userMap[_account];
    }
}