# smrk

## Testando localmente

Antes de tudo certifique-se que as portas 8080 e 3000 estejam livres para uso.

### Teste com Docker

  - Certifique-se de que tenha instalado docker e docker-compose;
    - docker: https://docs.docker.com/engine/install/
    - docker-compose: https://docs.docker.com/compose/install/
    
  - Execute o comando `docker-compose up --build --detach` na pasta `/deployments`;
 
  - Após a criação dos conteineres, o front-end(porta 3000) e back-end(porta 8080) terão suas portas redirecionadas do host para acesso e o teste pode ser feito na página `http://localhost:3000`;

O teste com docker já possui todas as configurações necessárias para o projeto no arquivo `/deployments/docker-compose.yml`.

### Teste Manual

  - Certifique-se de que tenha o mysql instalado e de que seu serviço esteja funcionando;
  - Altere o valor das credenciais `DB_USER` e `DB_PASS` no arquivo `/back-end/config/.env` com as credenciais root ou de usuário cadastradas com a instalação do mysql;
    - Também é possível criar outro usuário para essas credenciais e usa-los nas credencias:
      ```bash
        mysql -u root -p
        ...
        CREATE USER 'usuario'@'localhost' IDENTIFIED BY 'password';
        GRANT ALL PRIVILEGES ON * . * TO 'usuario'@'localhost';
        FLUSH PRIVILEGES;
      ```
      
      
  - Altere também o valor das credenciais `REACT_APP_IBM_API_URL` e `REACT_APP_IBM_API_KEY` para a api da IBM no arquivo `/front-end/smrk/.env`. Valor das credenciais para a conta gratuita criada:    
      - REACT_APP_IBM_API_URL: `https://api.us-south.text-to-speech.watson.cloud.ibm.com/instances/815f9e51-fea1-4c37-a1fc-b6261892f075`
      - REACT_APP_IBM_API_KEY: `ruCe0r9oqfaWotJbYKLih4zKTtkEQm-gSDna10aNYVFc`
  
      
  - Para iniciar o back-end, abra o terminal em sua pasta raíz e execute:
    ```npm
      npm install
      npm run migrate
      npm run build
      npm start
    ```
    Caso as configurações anteriores tenham sido feitas corretamente, o servidor deverá iniciar com sucesso.
    
    
  - Para iniciar o front-end, abra o terminal em sua pasta raíz e execute:
    ```npm
      npm install
      npm start
    ```
    Assim o acesso para a página em `http://localhost:3000` será liberado
