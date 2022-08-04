import Layout from "../components/Layout";
import { useContext, useEffect, useState } from 'react';
import { useAccount, useConnect, useDisconnect, useContractRead, useContractWrite, useContractEvent } from "wagmi"
import { useSignMessage } from 'wagmi'
import { ethers } from "ethers";
import ContextContractAddressABI from "../contexts/ContextContract";

const Homepage = () => {

  const { data: account } = useAccount();
  const contractAddressABI = useContext( ContextContractAddressABI );
  const [ contractBaseURL, setContractBaseURL ] = useState();
  const [ contractName, setContractName ] = useState();
  const [ tokenIDOwner, settokenIDOwner] = useState( "" );
  const [ mintTokenID, setMintTokenID ] = useState( 0 );
  const [ queryTokenID, setQueryTokenID ] = useState( -1 );
  const [ eventChangedBaseURI, setEventChangedBaseURI ] = useState( "" );
  const [ eventTransfer, setEventTransfer ] = useState( "" );
  const [ changeBaseURI, setChangeBaseURI ] = useState( "" );

  useContractEvent(
    contractAddressABI,
    "BaseURIChanged",
    ( event ) => {
      console.log( "BaseURIChanged : ", event );
      const json_event = JSON.stringify( event );
      localStorage.setItem("BaseURIChanged", json_event );
      setEventChangedBaseURI( json_event );
      contractBaseURLRead.refetch();
    },
  );

  useContractEvent(
    contractAddressABI,
    "Transfer",
    ( event ) => {
      const json_event = JSON.stringify( event );
      localStorage.setItem( "Transfer", json_event );
      setEventTransfer( json_event );
    },
  );

  const mySignMessage = useSignMessage({
    onSuccess : (data, variables) => {
      const price = ethers.utils.parseUnits("0.01", 18);
//      const address = verifyMessage(variables.message, data);
      contractMintWrite.write( {
        args : [ variables.tokenID, variables.signer, data ],
        overrides: {
          gasLimit: 300000,
          gasPrice: 60000000000,
          value: price,
        },
      } );


    }
  });

  const contractOwnerOfWrite = useContractWrite( 
    contractAddressABI,
    "ownerOf",
    {
      onSuccess : ( result ) => { settokenIDOwner( result.toString() ) }
    }

  );

  const contractMintWrite = useContractWrite(
    contractAddressABI,
    "mint",
    {
      onSuccess : ( result ) => { console.log( "contractMintWrite", result ) }
    }
  )

  const contractBaseURLRead = useContractRead(
    contractAddressABI,
    "__baseURI",
    {
      watch : true,
      onSuccess : ( result ) => { setContractBaseURL( result ) }
    }
  )

  const contractBaseURLWrite = useContractWrite(
    contractAddressABI,
    "setBaseURI",
    {
      onSuccess : ( result ) => { console.log( "contractBaseURLWrite", result ) }
    }
  )

  const contractNameRead = useContractRead(
    contractAddressABI,
    "name",
    {
      onSuccess : ( result ) => { setContractName( result ) }
    }
  )

  const onQueryTokenID = ( e ) => {
    setQueryTokenID( e.target.value );
  }

  const getTokenIDOwner = () => {
    contractOwnerOfWrite.write( {
      args : [ queryTokenID ],
    } );
  }

  const onMintTokenID = ( e ) => {
    setMintTokenID( e.target.value );
  }

  const myMint = () => {

    let tokenID = ethers.BigNumber.from( mintTokenID );
    let tokenOwner = account?.address;
    console.log( " tokenOwner : ", tokenOwner );

    let message = ethers.utils.solidityPack(["uint256", "address"], [tokenID, tokenOwner]);
    let hashedMessage= ethers.utils.keccak256(message);
    let binary = ethers.utils.arrayify(hashedMessage);

    mySignMessage.signMessage( {
      signer : tokenOwner,
      tokenID : tokenID,
      message : binary 
    } );

  }

  const onChangeBaseURI = ( e ) => {
    setChangeBaseURI( e.target.value );
  }

  const confirmBaseURI = () => {
    //changeBaseURI
    contractBaseURLWrite.write({
      args : [ changeBaseURI ],
    });
  }

  return (
    <Layout>
      <p>
        <input type="number" placeholder="Token ID" onChange={ onMintTokenID }></input>
        <button onClick={ myMint } > Mint </button>
      </p>
      <p>
        <input type="text" placeholder="BaseURI" onChange={ onChangeBaseURI }></input>
        <button onClick={ confirmBaseURI } > confirm </button>
      </p>
      <h2> 合約資訊 </h2>
      <p>ContractName : { contractName }</p>
      <p>BaseURL : { contractBaseURL }</p>
      <div>
        <div>查詢 : tokenID of owner</div>
        <input type="number" placeholder="Token ID"  onChange={ onQueryTokenID }></input>
        <button onClick={ getTokenIDOwner }> owner </button>
        <div>TokenID : { queryTokenID }, Owner : { tokenIDOwner } </div>
      </div>
      <h2>Event</h2>
      <p>changeBaseURI : { eventChangedBaseURI }</p>
      <p>Transfer : { eventTransfer }</p>

    </Layout>
  );
};

export default Homepage;