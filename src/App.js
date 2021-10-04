//import { waitForElementToBeRemoved } from "@testing-library/dom";
import React, { useEffect, useState, useRef } from "react";
import wordlist from './resources/words.json';

const MAX_TYPED_KEYS = 30;
const WORD_ANIMATION_INTERVAL = 500;
{/*COMPONENTES */}

{/*Consulta de Forma aleatoria*/}
const getWord = () => {
    {/*Retornando um numero aleatorio  do aquivo json  */}
    const index = Math.floor(Math.random() * wordlist.length);
        {/*Arredonda para baixo floor */}
    const word = wordlist[index];
    return word.toLowerCase();
}

const isValidKey = (key, word) => {
    if(!word) return false; 
    {/* Verificar se a tecla que foi digitada tem na palavra  1° verificação */}
    const result = word.split('').includes(key);
    {/*quebrar palavra em cada caracter e verificar se inclui a tecla correta que foi digitada */}
    return result; 

}

{/*Recebendo esses parametros */}
const Word = ({ word, validKeys}) => {
    if(!word) return null; 
    //juntando o array com string vazia e tranformado em um texto
    const joinedKeys = validKeys.join('');
    const matched = word.slice(0,joinedKeys.length);   //slice para pegar partes de uma string
    //em validkeys temos somente a ordem acertada, o matched ira pegar a palavra  do indice 0 ate o que temos como tamanho

    const remainder = word.slice(joinedKeys.length);
    //agora ao em vez de pegar do indice 0 onde ja havia digitado, ira pegar de onde foi digitado para frente

    const matchedClass = joinedKeys == word ? 'matched completed' : 'matched';

    return (
        <>  {/* Fragment <>   </> */}
            <span className = {matchedClass}>{matched}</span>
            <span className = "remainder">{remainder}</span>
        </>)
}

{/* APP no qual é rodado */}
const App = () =>  {
    const [typedKeys, setTypedKeys] = useState([]);
    const [validKeys, setValidKeys] = useState([]);
    const [completedWords, setCompletedWords] = useState([]);
    const [word, setWord] = useState('');
    const containerRef = useRef(null);

    //Hook ou algo parecido == rodar o que for pedido quando o componente inicializar

    //Quando inicializar deve definir uma palavra no set state
    useEffect(() => {
        {/* Dizendo que quer set word como getWord*/}
        setWord(getWord());
        if(containerRef) containerRef.current.focus();
    }, []); 
    //{} == função ||| [] == array de depedencias

    useEffect(()=>{
        const wordFromValidKeys = validKeys.join('').toLowerCase();
        let timeout = null;
        // verifcia se ela existe primeiro e se ela existir ai que ele adiciona a lista 
        if(word && word == wordFromValidKeys){//verificar se estao corretas
            timeout = setTimeout(()=>{
                // buscar uma nova palavra
                let newWord = null;
                do { {/*ira realizar o que for pedido equanto o while for verdadeiro */}
                    newWord = getWord();
                }while(completedWords.includes(newWord));
                //enquanto completed    tiver  newword   || se ja tiver a mesma palavra ela nao sera atribuida novamente, ate q uma nova seja pega
                
                {/*Sempre que acertar uma palavra ele ira adicionar uma nova, limpar o valid keys e definir o completedwords das acertadas  */}
                setWord(newWord);
    
                //limpar o array validKeys
                setValidKeys([]); // iniciado novavente do zero e vazio
    
                //adicionar word ao completedWords
                setCompletedWords((prev)=> [...prev, word]); // spredd'  Do prev com o word | parece significar uma junção dos dois 'spred'
            }, WORD_ANIMATION_INTERVAL);
        }

        return () =>{
            if(timeout) clearTimeout(timeout);
        }
    }, [word, validKeys, completedWords]);
    {/*uma das dependecias sera o validkeys se a cada vez q mudar ele deve verficar           join junta split separa*/}

    {/*Oque é digitado */}
    const handleKeyDown = (e) =>{
        e.preventDefault();
        const { key } = e;
        {/*Adicionado tudo aos ja existentes  add novos          tamanho maximo :: -30*/}
        setTypedKeys((prev) => [...prev, key].slice(MAX_TYPED_KEYS * -1));
        
        {/*Verificação para add os validos ao valid keys||| se oq foi digitado tem dentro desta palavra*/}
        if(isValidKey(key, word)){ {/*key == tecla digitada | word == palavra |||  se retornar true e uma tecla que pode ser add ao validKeys*/}
            {/*usar esse state e dentro dele pegar oq ja esta la (prev) */}
            setValidKeys((prev)=>{
                {/*1 Se oque ja tem em isvlaidKeys e menor ou igual do que a palavra q estamos buscando */}
                const isValidLength = prev.length <= word.length;

                {/*se esta no tamanho permitido e se a palavra que queremos na chave do que temos de tamanho é igual ao que foi 
                digitado|| Verificamos se o tamanho esta dentro do tamanho da palavra */}
                const isNextChar = isValidLength && word[prev.length] == key;
                return (isNextChar) ? [...prev, key] : prev;
                {/*se valido isso sera retornado    se n sera esse */}
            });
        }
    };

    return (
        <div className="container" tabIndex="0" onKeyDown={handleKeyDown} ref={containerRef}> 
            <div className = "valid-keys">
                {/* Receber as palavras e tamém as palavras digitads corretamentes */}
                <Word word={word} validKeys={validKeys}/>
            </div>           {/*se typedKeys existi      faça isso        se nao deixe null                nome disso é ternario*/}    
            <div className = "typed-keys">{typedKeys ? typedKeys.join(' ') : null }</div>
            <div className = "completed-words">
                <ol> {/*RETORNO IMPLICITO */}
                    {completedWords.map((word) => (
                    <li key={word}> {word} </li>))}
                    {/* Metodo antes
                    {completedWords.map((word)=>{
                        return (<li key={word}> {word} </li>)
                    })}
                    */}
                </ol>
            </div>
        </div>)
};

export default App;

