import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">NFT Marketplace</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav">
              <Link className="nav-link" aria-current="page" to="/mintNft">Mint</Link>
              <Link className="nav-link" to="/markForRent">Mark For Rent</Link>
              <Link className="nav-link" to="/viewMarkedRecord">View Marked Records</Link>
              <Link className="nav-link" to="/viewOnRentRecord">View OnRent Records</Link>
              <Link className="nav-link" to="/viewBorrowedRecord">View Borrowed Records</Link>
              <Link className="nav-link" to="/marketplace">Marketplace</Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
