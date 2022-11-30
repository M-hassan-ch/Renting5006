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
              <Link className="nav-link" aria-current="page" to="/createNft">Create NFT</Link>
              <Link className="nav-link" to="/viewMyNft">View My NFT</Link>
              <Link className="nav-link" to="/purchases">Purchases</Link>
              <Link className="nav-link" to="/marketplace">Marketplace</Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
