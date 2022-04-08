import React, { useEffect, useState } from 'react'
import InvoiceAbi from "../src/artifacts/contracts/Invoice.sol/Invoice.json"
import { ethers } from 'ethers'
import { useRouter } from 'next/router'

const contractAddress = '0x357b5Dc86F6248e2Bd75233e2B2Ad1FA58C09a06';

export const TransactionContext = React.createContext()

let eth

if (typeof window !== 'undefined') {
    eth = window.ethereum
}

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    const transactionContract = new ethers.Contract(
        contractAddress,
        contractABI.abi,
        signer,
    )

    return transactionContract
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter();
    const [invoices, setInvoices] = useState([])
    const [fetchStatus, setFetchStatus] = useState('')

    const [buyerPAN, setBuyerPAN] = useState()
    const [sellerPAN, setSellerPAN] = useState()
    const [amount, setAmount] = useState()
    const [date, setDate] = useState()
    const [paymentStatus, setPaymentStatus] = useState()
    const [sellerAddress, setSellerAddress] = useState('')
    const [invoiceNumber, setInvoiceNumber] = useState()

    async function requestAccount() {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
    }

    async function addInvoice(e) {
        e.preventDefault()
        if (!buyerPAN && !sellerPAN && !amount && !date && !sellerAddress) return
        if (typeof window.ethereum !== 'undefined') {
            setIsLoading(true);
            await requestAccount()
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractAddress, InvoiceAbi.abi, signer)
            const transaction = await contract.addInvoice(buyerPAN, sellerPAN, amount, date, paymentStatus, sellerAddress, invoiceNumber)
            await transaction.wait()
            console.log("Invoice Succesfully Created")
            alert("Invoice Succesfully Created")
            setIsLoading(false);
        }
    }

    async function getPaymentStatus(_invoiceNumber) {
        if (typeof window.ethereum !== 'undefined') {
            setIsLoading(true);
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(contractAddress, InvoiceAbi.abi, provider)
            try {
                const paymentStatus = await contract.getPaymentStatus(_invoiceNumber)
                setFetchStatus(paymentStatus.toString())
                alert("Payment Status fetched successfully")
            } catch (error) {
                console.error("Error: ", error)
                setIsLoading(false);
            }
            setIsLoading(false);
        }
    }

    async function getInvoices(_buyerPan) {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const contract = new ethers.Contract(contractAddress, InvoiceAbi.abi, provider)
            try {
                setIsLoading(true);
                const invoices = await contract.getInvoices(_buyerPan)
                setInvoices(invoices);
                alert('Invoices fetched successfully')
            } catch (error) {
                console.error("Error: ", error)
                setIsLoading(false);
            }
            setIsLoading(false);
        }
    }

    const checkIfWalletIsConnected = async (metamask = eth) => {
        try {
            if (!metamask) return alert('Please install metamask ')

            const chainId = await ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0x4') {
                alert('Please connect to RINKEBY');
                return;
            }
            const accounts = await metamask.request({ method: 'eth_accounts' })

            if (accounts.length) {
                setCurrentAccount(accounts[0])
            }
        } catch (error) {
            console.error(error)
            throw new Error('No ethereum object.')
        }
    }


    const connectWallet = async (metamask = eth) => {
        try {
            if (!metamask) return alert('Please install metamask ')
            const chainId = await ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0x4') {
                alert('Please connect to RINKEBY');
                return;
            }

            const accounts = await metamask.request({ method: 'eth_requestAccounts' })

            setCurrentAccount(accounts[0])

        } catch (error) {
            console.error(error)
            throw new Error('No ethereum object.')
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    return (
        <TransactionContext.Provider
            value={{
                connectWallet,
                currentAccount,
                isLoading,
                setBuyerPAN,
                setSellerPAN,
                setSellerAddress,
                setAmount,
                setDate,
                setPaymentStatus,
                setInvoiceNumber,
                addInvoice,
                getPaymentStatus,
                getInvoices,
                invoices,
                fetchStatus
            }}
        >
            {children}
        </TransactionContext.Provider>
    )
}