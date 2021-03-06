pragma solidity ^0.4.21;

contract XCharge {

    mapping(address => uint256) funds;

    modifier onlyNodeAccount(address user) {
        require(user == 0xd9D05191E84843a2742e555c9d968F623239f669);
        _;
    }

    function depositFunds() public payable {
        funds[msg.sender] += msg.value;
    }

    function reclaimFunds() public {
        address user = msg.sender;
        if (funds[user] > 0) {
            uint256 toSend = funds[user];
            funds[user] = 0;
            user.transfer(toSend);
            emit Reclaimed(user, toSend);
        }
    }

    function useFunds(address user, uint256 amount) public onlyNodeAccount(msg.sender)
        returns(bool useable) {

        if (funds[user] < amount)
            return false;
        else {
            funds[user] -= amount;
            msg.sender.transfer(amount);
            emit FundsUsed(user, amount);
            return true;
        }
    }

    function refund(address user) public payable {
        if (msg.value < 1)
            return;

        funds[user] += msg.value;
        emit Refund(user, msg.value);
    }

    // VFT
    function showBalance() public view
        returns(uint256 value) {

        return address(this).balance;
    }

    // VFT
    function showFundsOf(address user) public view
        returns(uint256 value) {

        return funds[user];
    }

    event Deposit(address indexed user, uint256 amount);
    event Reclaimed(address indexed user, uint256 amount);
    event FundsUsed(address indexed user, uint256 amount);
    event Refund(address indexed user, uint256 amount);
}
