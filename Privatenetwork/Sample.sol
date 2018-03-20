pragma solidity 

/**
 * The Helloworld contract does this and that...
 */
contract Helloworld {
    uint counter = 0;

	function Helloworld () {
		
	}	
	function increase () {
		counter++;
	}
	function decrease () {
		counter--;
	}
	function myFunction () returns(uint) {
		return counter;
	}
}


