//SPDX-License-Identifier: Unlicense

pragma solidity ^0.8.4;
import "hardhat/console.sol";

contract Invoice {
    struct Transaction {
        uint256 id;
        string buyerPAN;
        string sellerPAN;
        uint256 amount;
        uint256 date;
        bool paymentStatus;
        address payable sellerAddress;
    }

    mapping(string => Transaction[]) private invoices;
    mapping(uint256 => Transaction) private allInvoices;

    function addInvoice(
        string memory _buyerPAN,
        string memory _sellerPAN,
        uint256 _amount,
        uint256 _date,
        bool _paymentStatus,
        address payable _sellerAddress,
        uint256 _id
    ) public {
        invoices[_buyerPAN].push(
            Transaction({
                id: _id,
                buyerPAN: _buyerPAN,
                sellerPAN: _sellerPAN,
                amount: _amount,
                date: _date,
                paymentStatus: _paymentStatus,
                sellerAddress: _sellerAddress
            })
        );

        allInvoices[_id] = Transaction({
            id: _id,
            buyerPAN: _buyerPAN,
            sellerPAN: _sellerPAN,
            amount: _amount,
            date: _date,
            paymentStatus: _paymentStatus,
            sellerAddress: _sellerAddress
        });
    }

    function getInvoices(string memory _buyerPAN)
        public
        view
        returns (Transaction[] memory)
    {
        return (invoices[_buyerPAN]);
    }

    function getPaymentStatus(uint256 _id) public view returns (bool) {
        if (allInvoices[_id].paymentStatus == true) {
            return true;
        } else {
            return false;
        }
    }
}
