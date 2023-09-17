// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import {VRFCoordinatorV2Interface} 
from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} 
from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import {Ownable} 
from "@openzeppelin/contracts/access/Ownable.sol";
// import {AutomationCompatibleInterface} 
// from "@chainlink/contracts/src/v0.8/AutomationCompatible.sol";




contract Lottery is VRFConsumerBaseV2,Ownable{

    //state variables
    address payable[] public s_enties;
    VRFCoordinatorV2Interface internal immutable i_vrfInterface;
    address internal immutable i_owner;
    bytes32 internal immutable keyhash;
    uint32 immutable internal num_words;
    uint16 immutable internal requestConfirmations;
    uint32 immutable internal callbackGasLimit;
    uint64 immutable  s_subscriptionId;
    address[] public i_prev_winners;

    uint256 public s_randomWord;
    uint256 internal immutable I_entrace_fee;
    LotteryState public isActive;
    uint256 constant public i_time_interval=100000;
    uint256 internal starttime;

    //erros

    error Lottery__EntranceFees(string msg);
    error Lottery__FaildToTransfer(string msg);
    error Lottery_NotActive(string msg);
    error Lottery_Active(string msg);
    error Lottery__NotEnoughPlayers();
    

    

    //events
    event RequestSent(uint256 indexed requestId, uint32 indexed numWords);
    event RequestFulfilled(uint256 indexed requestId, uint256[] indexed randomWords);
    event WinnerSelected(address payable indexed winner);



    //lottry states
    enum LotteryState {
        OPEN,CLOSE,CALCULATING//0,1,2
    }


    //vrf cordinator 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625 for sepolia
    //keyhash sepolia 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c


    constructor(
        address vrfCordinatorAddress,
        bytes32 _keyhash,
        uint32 subID,
        uint32 _callbackgaslimit
        
        ) 
        VRFConsumerBaseV2(vrfCordinatorAddress)
        {
            i_vrfInterface=VRFCoordinatorV2Interface(vrfCordinatorAddress);
            i_owner=msg.sender;
            keyhash=_keyhash;
            num_words=1;
            s_subscriptionId=subID;
            callbackGasLimit=_callbackgaslimit;
            requestConfirmations = 3;
            I_entrace_fee=0.01 ether;

            starttime=block.timestamp;

            isActive=LotteryState.OPEN;

           
    }

    //functions

    /*
    @dev function for enter to the lotter
    @notic caller must pay entrance fees of 0.001 eth
    */
    function enter() external  payable {

        if(msg.value!=I_entrace_fee){
            revert Lottery__EntranceFees("please pay the correct entrace fees");
        }
        if(isActive!=LotteryState.OPEN){
            revert Lottery_NotActive("Lottery is not active yet!");
        }

        s_enties.push(payable(msg.sender));

    }

    function pickWinner() public onlyOwner{
        //call the requestRandomwords function here

        require(block.timestamp-starttime>=i_time_interval,"Not enough time");

        requestRandomWords();
    }


    /*
    @dev requesting random words
    @notic entries should be greater than 0
            lottery need to be in open state

    */

    function requestRandomWords() internal  {

        if(!(s_enties.length>0)){
            revert Lottery__NotEnoughPlayers();
        }

        if(isActive == LotteryState.CALCULATING || isActive== LotteryState.CLOSE){
            revert Lottery_NotActive("Lottery is not active at the moment");
        }

        isActive=LotteryState.CALCULATING;

        uint256 requestId=i_vrfInterface.requestRandomWords(
            keyhash, 
            s_subscriptionId, 
            requestConfirmations,
             callbackGasLimit, 
             num_words
             );
        
        emit RequestSent(requestId,num_words);

    }


    /*
    @dev this will be called by the subscriber
    */
    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords) internal override{

            s_randomWord=randomWords[0];
            
            uint256 index=s_randomWord % s_enties.length;
            
           
            address payable winner=s_enties[index];
            
            i_prev_winners.push(winner);
            
            (bool suc,)=winner.call{value:address(this).balance}("");

            if(!suc){
                revert Lottery__FaildToTransfer("Tranfer failed!");
            }
            isActive=LotteryState.OPEN;

            
            
            emit  WinnerSelected(winner);
            
            starttime=block.timestamp;
            
           //reset the players array don't work
           restEnties();
            
    } 

    function restEnties() internal {
        s_enties=new address payable[](0);
    }

   

    function getarr() public view returns (uint256) {
        return s_enties.length;
    }


    function getOwner() public view returns(address){
        return i_owner;
    }

    function getEntraceFee()public view returns(uint256){
        return I_entrace_fee;
    }

    function getLatestWinner() public view returns(address){

        require(i_prev_winners.length>0,"No any previous winners");
        return  i_prev_winners[i_prev_winners.length-1];
    }

    /*
    returns 0 for open
    1 for closed
    2 for calculating
    */
    function getState() public view returns(LotteryState){
        return isActive;
    }

    





}