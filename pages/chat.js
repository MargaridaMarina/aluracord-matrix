import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyNzM5NSwiZXhwIjoxOTU4OTAzMzk1fQ.2wYoOULQ8dA66Kz3FiMmlseAvpj2a8h7iEYVHLqPr2M';
const SUPABASE_URL = 'https://tphxlcnhquwyhhevwteu.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// fetch(`${SUPABASE_URL}/rest/v1/messagens?select=*`, {
//   headers: {
//     'Content-Type': 'application/json',
//     'apikey': SUPABASE_ANON_KEY,
//     'Authotization': 'Bearer ' + SUPABASE_ANON_KEY
//   }
// })
//   .then((res) =>{
//     return res.json();
//   })
//   .then((response) => {
//     console.log(response);
//   });


export default function ChatPage() {
  /* 
  //Usuário
  -Usuário digita no campo textarea
  -Aperta enter para enviar
  -Tem que adicionar o texto na listagem
 
  //Dev
  -Campo criado
  - Vamos usar o onChange, usa o useState (ter if para caso seja enter para limpar a variavell)
  - Lista de mensagens
  */

  const [mensagem, setMensagem] = React.useState('');
  //a primeira é o valor que vamos usar para mostrar e a segunda é o método para se quisermos alterar a mensagem usarmos ele, nao mudar o primeiro
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  React.useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        console.log('Dados da consulta:', data);
        setListaDeMensagens(data);
      });
  }, []);

  function handleNovaMensagem(novaMensagem){
    const mensagem = {
      id: listaDeMensagens.length + 1,
      de: 'margaridamarina',
      texto: novaMensagem,
    }
    supabaseClient
    .from('mensagens')
    .insert([
      // Tem que ser um objeto com os MESMOS CAMPOS que você escreveu no supabase
      mensagem
    ])
    .then(({ data }) => {
      console.log('Criando mensagem: ', data);
      setListaDeMensagens([
        data[0],
        ...listaDeMensagens,
      ]);
    });
    setMensagem('');
  }



    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary['500'],
                backgroundImage: `url(https://m.media-amazon.com/images/M/MV5BODA2Mjk0N2MtNGY0Mi00ZWFjLTkxODEtZDFjNDg4ZDliMGVmXkEyXkFqcGdeQXVyMzAzNTY3MDM@._V1_.jpg)`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens = {listaDeMensagens}/>

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                              const valor = event.target.value;
                              setMensagem(valor);
                            }}
                            onKeyPress={(event)=>{
                              if(event.key == 'Enter'){
                                event.preventDefault();
                                console.log(event);
                                handleNovaMensagem(mensagem);
                              }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    console.log(props);
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
              return(
                <Text
                key={mensagem.id}
                tag="li"
                styleSheet={{
                    borderRadius: '5px',
                    padding: '6px',
                    marginBottom: '12px',
                    hover: {
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                    }
                }}
            >
                <Box
                    styleSheet={{
                        marginBottom: '8px',
                    }}
                >
                    <Image
                        styleSheet={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            display: 'inline-block',
                            marginRight: '8px',
                        }}
                        src={`https://github.com/${mensagem.de}.png`}
                    />
                    <Text tag="strong">
                        {mensagem.de}
                    </Text>
                    <Text
                        styleSheet={{
                            fontSize: '10px',
                            marginLeft: '8px',
                            color: appConfig.theme.colors.neutrals[300],
                        }}
                        tag="span"
                    >
                        {(new Date().toLocaleDateString())}
                    </Text>
                </Box>
                {mensagem.texto}
            </Text>
            );
                      {/* {listaDeMensagens.map((mensagemAtual) => {
                      console.log(mensagemAtual)
                      return (
                        <li key={mensagemAtual.id}>
                          {mensagemAtual.de}: {mensagemAtual.texto}
                        </li>
                      )
                    })} */}
            })}
            
        </Box>
    )
}