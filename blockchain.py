import json
from web3 import Web3

ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

web3.eth.defaultAccount = web3.eth.accounts[0]

abi = json.loads(
    '[{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"getHash","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"hash","type":"string"}],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"hashToOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"ownerToHash","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"hash","type":"string"}],"name":"setHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_oldhash","type":"string"},{"internalType":"string","name":"_newhash","type":"string"}],"name":"updateHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_newowner","type":"address"},{"internalType":"string","name":"hash","type":"string"}],"name":"updateOwner","outputs":[],"stateMutability":"nonpayable","type":"function"}]'
)
address = web3.toChecksumAddress("0x5BbC9a39CE9b7dbccd791be199771e0C492554A9")

contract = web3.eth.contract(address=address, abi=abi)


def getHash():
    return contract.functions.getHash(web3.eth.defaultAccount).call()


def getOwner(hash):
    return contract.functions.getOwner(hash).call()


def setHash(hash):
    tx_hash = contract.functions.setHash(hash).transact()
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    return tx_receipt


def updateHash(oldhash, newhash):
    tx_hash = contract.functions.updateHash(oldhash, newhash).transact()
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    return tx_receipt


def updateOwner(newowner, hash):
    tx_hash = contract.functions.updateOwner(newowner, hash).transact()
    tx_receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    return tx_receipt
