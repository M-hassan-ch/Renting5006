import Navbar from './Components/Navbar';
import CreateNft from './Components/CreateNft';
import Marketplace from './Components/Marketplace';
import ViewMyNft from './Components/ViewMyNft';
import MarkForRent from './Components/MarkForRent';
import MarkedRecord from './Components/MarkedRecord';
import BorrowedRecord from './Components/BorrowedRecord';
import Purchases from './Components/Purchases'
import './App.css';
import React from 'react';
import { ContractState } from './context/contractState';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <>
      {/* <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<React.Fragment>
            <CreateNft />
          </React.Fragment>}>
          </Route>

          <Route path="/createNft" element={<React.Fragment>
            <CreateNft />
          </React.Fragment>}>
          </Route>

          <Route path="/purchases" element={<React.Fragment>
            <Purchases />
          </React.Fragment>}>
          </Route>

          <Route path="/marketplace" element={<React.Fragment>
            <Marketplace />
          </React.Fragment>}>
          </Route>

          <Route path="/viewMyNft" element={<React.Fragment>
            <ViewMyNft />
          </React.Fragment>}>
          </Route>

        </Routes>
      </BrowserRouter> */}
      <ContractState>
        <CreateNft />
        <ViewMyNft />
        <MarkForRent></MarkForRent>
        <MarkedRecord></MarkedRecord>
        <BorrowedRecord></BorrowedRecord>
      </ContractState>
    </>
  );
}

export default App;
