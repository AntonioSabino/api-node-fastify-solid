# App

App estilo GymPass.

## RFs (Requisitos funcionais)

- [x] Deve ser possível se cadastrar;
- [x] Deve ser possível se autenticar;
- [x] Deve ser possível obter o perfil de um usuário logado;
- [ ] Deve ser possível obter o número de checkins de um usuário logado;
- [ ] Deve ser possível obter seu histórico de checkins;
- [ ] Deve ser possível buscar academias próximas;
- [ ] Deve ser possível buscar academias por nome;
- [x] Deve ser possível o usuário realizar checkin em uma academia;
- [ ] Deve ser possível validar o checkin de um usuário;
- [x] Deve ser possível cadastrar uma academia;

## RNs (Regras de Negócio)

- [x] O usuário não deve poder se cadastrar com um e-mail já existente;
- [x] O usuário não deve poder fazer 2 checkins no mesmo dia;
- [x] O usuário não deve poder fazer checkin se não estiver perto (100m) da academia;
- [ ] O checkin só pode ser validado até 20 minutos após criado;
- [ ] O checkin só pode ser validado por um usuário com perfil de administrador;
- [ ] A academia só pode ser cadastrada por um usuário com perfil de administrador;

## RNFs (Requisitos não funcionais)

- [x] A senha do usuário deve ser armazenada criptografada;
- [x] Os dados da aplicação devem ser armazenados em um banco postgres;
- [ ] Todas listas de dados devem ser paginadas com limite de 20 itens por página;
- [ ] O usuário deve ser identificado através de um token JWT;