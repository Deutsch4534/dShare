pragma solidity ^0.4.25;

contract FileFactory {
    mapping(address => address[]) public deployedFiles;
    mapping(address => address[]) public sharedFiles;
    
    function createFile(bytes32 _digest, uint8 _hashFunction, uint8 _size) public {
        address newFile = new File(_digest, _hashFunction, _size, msg.sender, this);
        deployedFiles[msg.sender].push(newFile);
    }
    
    function getMyFiles() public view returns(address[]) {
        return deployedFiles[msg.sender];
    }
    
    function updateSharedFiles(address recipient, address file) public {
        sharedFiles[recipient].push(file);
    }
    
    function getSharedFiles() public view returns(address[]) {
        return sharedFiles[msg.sender];
    }
}

contract File {
    address public manager;
    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
  }
  
  FileFactory ff;
  
  Multihash fileIpfsHash;
  Multihash keyIpfsHash;
    
    mapping(address => bool) shared;
    mapping(address => Multihash) keyLocation;
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    constructor(bytes32 _digest, uint8 _hashFunction, uint8 _size, address creator, address factory) public {
        fileIpfsHash = Multihash(_digest, _hashFunction, _size);
        manager = creator;
        ff = FileFactory(factory);
    }
    
    function shareFile(address recipient, bytes32 _digest, uint8 _hashFunction, uint8 _size) public restricted {
        keyIpfsHash = Multihash(_digest, _hashFunction, _size);
        shared[recipient] = true;
        keyLocation[recipient] = keyIpfsHash;
        ff.updateSharedFiles(recipient, this);
    }
    
    function getSharedFileDetail() public view returns (bytes32 , uint8 , uint8 , bytes32 , uint8 , uint8 ){
        require(shared[msg.sender]);
        return (fileIpfsHash.digest, fileIpfsHash.hashFunction, fileIpfsHash.size, keyLocation[msg.sender].digest, keyLocation[msg.sender].hashFunction, keyLocation[msg.sender].size);
    }
    
    function getFileDetail() public view restricted returns (bytes32 _digest, uint8 _hashFunction, uint8 _size){
        return (fileIpfsHash.digest, fileIpfsHash.hashFunction, fileIpfsHash.size);
    }
}