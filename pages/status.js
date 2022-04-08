import React, { useState, useContext } from 'react'
import { TransactionContext } from '../context/TransactionContext'
import Modal from 'react-modal'
import TransactionLoader from '../components/TransactionLoader'
Modal.setAppElement('#__next')

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#0a0b0d',
      padding: 0,
      border: 'none',
    },
    overlay: {
      backgroundColor: 'rgba(10, 11, 13, 0.75)',
    },
  }
  

const Status = () => {
    const { getPaymentStatus, fetchStatus, isLoading } = useContext(TransactionContext);
    const [search, setSearch] = useState()

    const handleSearch = () => {
        console.log(search)
        getPaymentStatus(search);
    }

    return (
        <div>
            <div className='max-w-4xl mx-auto w-full mt-16'>
                <p className='text-xl'>Search Invoices</p>
                <div className="flex items-center p-6 space-x-6 bg-white rounded-xl shadow-lg hover:shadow-xl ">
                    <div className="flex bg-gray-100 p-4 w-full space-x-4 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input className="bg-gray-100 outline-none" type="text" placeholder="Unique trasaction Id: " value={search} onChange={e => setSearch(e.target.value)} />
                    </div>
                    <div className="text-black text-sm font-semibold border px-5 py-3 rounded-lg hover:text-black hover:border-black" onClick={handleSearch}>
                        <span>Search</span>
                    </div>
                </div>
                {/* <div className='mt-6'>
                    {invoices.map(invoice => (
                        
                        ))}
                    </div> */}
                <div className="grid grid-cols-2 items-center p-6 space-x-6 bg-white rounded-xl shadow-lg hover:shadow-xl mt-4">

                    <span className='ml-6'>PAYMENT STATUS:</span><p className="text-black text-sm font-semibold border px-5 py-3 rounded-lg hover:text-black hover:border-black">{fetchStatus}</p>

                </div>
            </div>
            <Modal isOpen={isLoading} style={customStyles}>
        <TransactionLoader />
      </Modal>
        </div>
    )
}

export default Status