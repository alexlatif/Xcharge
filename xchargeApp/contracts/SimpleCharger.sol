pragma solidity ^0.4.21;

contract SimpleCharger {

    string public name;
    // this is the rate in Szabo per kWh.
    uint256 public rate;
    EnergyType public kind;

    address private currentlyCharging;
    mapping(address => uint256) funds;

    modifier onlyNodeAccount(address user) {
        require(user == 0xd9D05191E84843a2742e555c9d968F623239f669);
        _;
    }

    function SimpleCharger(string _name, uint256 _rate, EnergyType energyType) public {
        name = _name;
        rate = _rate;
        kind = energyType;
    }

    function deposit(address user) public payable {
        if (msg.value == 0)
            return;

        funds[user] += msg.value;
        emit Deposit(user, msg.value);
    }

    function startCharging(address user, uint256 timestamp) public {
        emit StartedCharging(user, timestamp);
    }

    //                                      The amount charged in kWh.
    function stopCharging(address user, uint256 amount, uint256 timestamp) public {
        reduceFunds(user, amount);
        emit StoppedCharging(user, amount, timestamp);
    }

    function reclaim(address user) public onlyNodeAccount(msg.sender) {
        if (funds[user] > 0) {
            uint256 toSend = funds[user];
            funds[user] = 0;
            msg.sender.transfer(toSend);
            emit Reclaimed(user, toSend);
        }
    }

    function reduceFunds(address user, uint256 amount) private {
        uint256 reduction = rate * amount * 1 szabo;
        funds[user] -= reduction;
    }

    // VFT
    function showBalance() public view
        returns(uint256 value) {
        
        return address(this).balance;
    }

    //VFT
    function showFundsOf(address user) public view
        returns(uint256 value) {

        return funds[user];
    }

    event StartedCharging(address indexed customer, uint256 timestamp);
    event StoppedCharging(address indexed user, uint256 amount, uint256 timestamp);
    event Deposit(address indexed user, uint256 amount);
    event Reclaimed(address indexed user, uint256 amount);

    enum EnergyType {
        FOSSIL,
        NUCLEAR,
        GREEN
    }
}
