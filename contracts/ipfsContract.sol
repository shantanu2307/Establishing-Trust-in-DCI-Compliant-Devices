// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.6;

contract ipfsContract {
    mapping(address => string[]) public ownerToHash;
    mapping(string => address) public hashToOwner;

    function setHash(string memory hash) public {
        ownerToHash[msg.sender].push(hash);
        hashToOwner[hash] = msg.sender;
    }

    function getHash(address owner) public view returns (string[] memory) {
        return ownerToHash[owner];
    }

    function getOwner(string memory hash) public view returns (address) {
        return hashToOwner[hash];
    }

    function updateHash(string memory _oldhash, string memory _newhash) public {
        address owner = hashToOwner[_oldhash];
        delete hashToOwner[_oldhash];
        hashToOwner[_newhash] = owner;
        for (uint256 i = 0; i < ownerToHash[owner].length; i++) {
            if (
                keccak256(abi.encodePacked(ownerToHash[owner][i])) ==
                keccak256(abi.encodePacked(_oldhash))
            ) {
                ownerToHash[owner][i] = _newhash;
            }
        }
    }

    function updateOwner(address _newowner, string memory hash) public {
        address owner = hashToOwner[hash];
        delete hashToOwner[hash];
        hashToOwner[hash] = _newowner;
        ownerToHash[_newowner].push(hash);
        for (uint256 i = 0; i < ownerToHash[owner].length; i++) {
            if (
                keccak256(abi.encodePacked(ownerToHash[owner][i])) ==
                keccak256(abi.encodePacked(hash))
            ) {
                delete ownerToHash[owner][i];
            }
        }
    }
}
