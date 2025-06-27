# Aplicativo-Eletronics-Store
## Tecnologias Utilizadas

*   **React Native:** Framework para desenvolvimento de aplicativos móveis multiplataforma.
*   **Expo:** Plataforma e conjunto de ferramentas para facilitar o desenvolvimento com React Native.
*   **Supabase:** Backend como serviço (BaaS) para autenticação e banco de dados PostgreSQL.
*   **JavaScript:** Linguagem de programação principal.
*   **React Navigation:** Biblioteca para gerenciamento de navegação entre telas.

## Configuração e Execução

Para executar o projeto localmente, siga os passos abaixo:

1.  **Clone o Repositório:**
    ```bash
    git clone https://github.com/karolsoares/Aplicativo-Eletronics-Store.git
    cd aplicativocompras 
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    # ou
    # yarn install
    ```

3.  **Configure o Supabase:**
    *   Crie um projeto no [Supabase](https://supabase.com/).
    *   Atualize o arquivo `/AplicativoCompras/services/supabaseClient.js` com a URL e a Chave Anônima (anon key) do SEU projeto Supabase:
        ```javascript
        const supabaseUrl = "SUA_URL_SUPABASE"; // Substitua pela sua URL
        const supabaseAnonKey = "SUA_CHAVE_ANON_SUPABASE"; // Substitua pela sua chave
        ```

4.  **Inicie o Aplicativo com Expo:**
    ```bash
    npm start
    # ou
    # expo start
    ```
    Isso abrirá o Metro Bundler. Você pode então escanear o QR code com o aplicativo Expo Go no seu dispositivo móvel (Android ou iOS) ou executar em um emulador/simulador.

## Desenvolvedores

*  Felipe Guindani, Leonardo Osvald, Karoline Soares