import React, { useEffect, useState } from 'react';
import './SelectCharacter.css';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';


const SelectCharacter = ({ setCharacterNFT }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);

  return (
    <div className="select-character-container">
      <h2>Mint Your Regular. Choose wisely lol.</h2>
    </div>
  );

  // UseEffect
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      /*
      * This is the big difference. Set our gameContract in state.
      */
      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  useEffect(() => {
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');

        /*
        * Call contract to get all mint-able characters
        */
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log('charactersTxn:', charactersTxn);

        /*
        * Go through all of our characters and transform the data
        */
        const characters = charactersTxn.map((characterData) =>
          transformCharacterData(characterData)
        );

        /*
        * Set all mint-able characters in state
        */
        setCharacters(characters);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };

    /*
    * If our gameContract is ready, let's get characters!
    */
    if (gameContract) {
      getCharacters();
    }
  }, [gameContract]);
};

export default SelectCharacter;