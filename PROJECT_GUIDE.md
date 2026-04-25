# PROJECT GUIDE

Guia mestre de desenvolvimento para um sistema fullstack offline-first, schema-driven e preparado para evoluir para uma plataforma low-code.

Este documento deve ser usado como referência principal antes de qualquer implementação. A prioridade é construir o sistema em etapas pequenas, testáveis e compreensíveis, evitando complexidade prematura.

---

# 1. VISÃO GERAL DO SISTEMA

O sistema será uma aplicação fullstack composta por:

- Frontend em React, TypeScript, Tailwind CSS e PWA.
- Estado global com Zustand.
- Formulários com React Hook Form.
- Validação com Zod.
- Armazenamento offline com IndexedDB via Dexie.js.
- Service Worker com Workbox.
- Backend em Node.js, TypeScript e NestJS.
- Banco de dados PostgreSQL.
- ORM Prisma.

O objetivo de longo prazo é criar uma plataforma que evolua para um low-code builder. Isso significa que usuários finais poderão criar telas, formulários, listagens, estruturas de dados e fluxos simples sem escrever código.

## Schema-driven UI

Schema-driven UI é a abordagem em que a interface não é escrita manualmente tela por tela. Em vez disso, a aplicação recebe um schema declarativo que descreve:

- Quais campos aparecem na tela.
- Qual componente deve renderizar cada campo.
- Quais validações se aplicam.
- Como os dados são organizados.
- Quais ações estão disponíveis.
- Quais permissões, estados e regras condicionais afetam a interface.

O React continua sendo responsável por renderizar componentes reais. O schema apenas descreve a intenção da tela. O sistema nunca deve gerar HTML como string.

## Component Registry

O component registry é um catálogo central de componentes disponíveis para renderização dinâmica.

Exemplo conceitual:

- `text-input` aponta para um componente de campo de texto.
- `select` aponta para um componente de seleção.
- `date-picker` aponta para um componente de data.
- `data-table` aponta para um componente de listagem.

O renderer dinâmico recebe o schema, identifica o tipo de componente solicitado e busca a implementação correspondente no registry.

Essa separação permite que a plataforma cresça sem duplicar componentes e sem espalhar regras de renderização por várias telas.

## Low-code Builder

O low-code builder será a evolução visual do sistema. Ele permitirá que usuários configurem sistemas por meio de uma interface gráfica, incluindo:

- Criação de entidades.
- Definição de colunas e tipos de dados.
- Configuração de formulários.
- Configuração de listagens.
- Definição de filtros.
- Regras condicionais entre campos.
- Publicação de telas baseadas em schemas.

O builder não deve ser a primeira coisa a ser implementada. Primeiro será construída a base: componentes, schemas, renderer, persistência local, sincronização e backend versionado.

## Offline-first

Offline-first significa que a aplicação deve continuar funcionando mesmo sem conexão após o primeiro carregamento.

Na prática:

- O shell da aplicação deve ser cacheado pelo PWA.
- Os dados necessários devem ser armazenados localmente no IndexedDB.
- A interface deve carregar primeiro os dados locais.
- Alterações feitas offline devem entrar em uma fila de pendências.
- A sincronização deve ocorrer em background quando houver conexão.
- O usuário não deve depender de uma resposta imediata do servidor para continuar usando o sistema.

---

# 2. ARQUITETURA GERAL

## Frontend

O frontend será responsável por:

- Renderizar a aplicação React.
- Interpretar schemas de UI.
- Renderizar componentes por meio do component registry.
- Gerenciar estado global com Zustand.
- Gerenciar formulários com React Hook Form.
- Validar dados com Zod.
- Persistir dados offline com Dexie.js.
- Registrar e controlar o Service Worker.
- Executar fluxos de sincronização em background.

A aplicação deve ser organizada por responsabilidades, evitando misturar componentes visuais, regras de schema, lógica offline e chamadas de API no mesmo lugar.

## Backend

O backend em NestJS será responsável por:

- Expor APIs versionadas.
- Persistir dados no PostgreSQL via Prisma.
- Controlar autenticação e autorização em etapas futuras.
- Receber alterações locais enviadas pelo cliente.
- Fornecer alterações remotas para sincronização.
- Manter versionamento de registros.
- Preparar suporte futuro para schemas dinâmicos.

O backend deve ser modular desde o início, mas sem abstrações desnecessárias. Cada módulo deve ter uma responsabilidade clara.

## Banco

O PostgreSQL será a fonte de verdade do sistema no servidor.

Inicialmente, o banco deve modelar entidades simples e estáveis. A camada dinâmica de schema deve ser introduzida gradualmente, quando o fluxo básico de dados, formulários, listagens e sincronização já estiver validado.

O Prisma será usado como ORM para:

- Definir o modelo de dados.
- Gerar client tipado.
- Executar migrations.
- Centralizar acesso ao banco no backend.

## Camada offline

A camada offline será baseada em:

- IndexedDB como banco local.
- Dexie.js como wrapper para acesso estruturado.
- Uma estrutura local que armazene dados, versões, metadados e pendências.
- Uma fila de operações locais ainda não sincronizadas.

Essa camada não deve ser tratada como cache simples. Ela será uma parte central da arquitetura.

## Sync engine

O sync engine será responsável por coordenar:

- Leitura de alterações locais pendentes.
- Envio dessas alterações para o backend.
- Busca de alterações remotas.
- Atualização do IndexedDB.
- Controle de versão local e remota.
- Tratamento de conflitos em versões futuras.

No início, o sync deve ser simples e previsível. Conflitos complexos devem ser mapeados, mas não resolvidos prematuramente.

---

# 3. PRINCÍPIOS FUNDAMENTAIS

## Não duplicar componentes

Todo componente reutilizável deve viver em uma biblioteca central. Telas específicas não devem recriar variações locais de inputs, selects, botões, tabelas ou layouts quando já existir um componente padrão.

A duplicação é especialmente perigosa em uma plataforma low-code, porque qualquer diferença entre componentes aumenta o custo do renderer dinâmico, do builder visual e da manutenção futura.

## Evitar abstração excessiva

O projeto deve crescer por necessidade real, não por especulação.

Antes de criar uma abstração, verificar:

- Existe repetição concreta?
- A abstração reduz complexidade?
- Ela preserva clareza?
- Ela será usada por mais de uma parte do sistema agora?

Abstrações para problemas futuros devem ser evitadas até que o problema exista de forma clara.

## Não gerar HTML como string

O sistema nunca deve montar HTML manualmente como string para renderizar interfaces.

O caminho correto é:

- Schema descreve a tela.
- Renderer interpreta o schema.
- Registry resolve o tipo de componente.
- React renderiza componentes reais.

Isso preserva tipagem, segurança, composição, validação, acessibilidade e manutenção.

## Uso obrigatório das bibliotecas definidas

As seguintes bibliotecas devem ser usadas como padrão:

- React Hook Form para controle de formulários.
- Zod para validação e definição de contratos.
- Zustand para estado global compartilhado.
- Dexie.js para IndexedDB.
- Workbox para Service Worker.
- Prisma para acesso ao banco no backend.

Não criar soluções próprias para esses problemas sem uma justificativa técnica forte.

## Código simples e escalável

Simplicidade não significa ausência de arquitetura. Significa:

- Responsabilidades claras.
- Baixo acoplamento.
- Poucos caminhos mágicos.
- Tipos explícitos.
- Fluxos testáveis.
- Módulos pequenos.
- Evolução incremental.

---

# 4. ARQUITETURA DE COMPONENTES

## Component Library

A component library será a base visual e funcional do sistema.

Ela deve conter componentes reutilizáveis como:

- Inputs.
- Selects.
- Checkboxes.
- Date pickers.
- Botões.
- Modais.
- Tabelas.
- Filtros.
- Estados vazios.
- Mensagens de erro.
- Layouts internos.

Cada componente deve ser projetado para uso manual e também para uso pelo renderer dinâmico.

Critérios importantes:

- Props previsíveis.
- Suporte a erro e estado desabilitado.
- Integração simples com React Hook Form.
- Estilo consistente com Tailwind CSS.
- Acessibilidade mínima desde o início.
- Evitar dependência de contexto global desnecessário.

## Component Registry

O registry será o mapa entre o schema e os componentes React reais.

Ele deve responder perguntas como:

- Qual componente renderiza o tipo `text`?
- Qual componente renderiza o tipo `number`?
- Qual componente renderiza o tipo `select`?
- Quais props do schema são aceitas por esse componente?
- Quais tipos de validação esse componente suporta?

O registry deve ser simples no início. Ele pode começar como um objeto ou estrutura centralizada e evoluir depois para metadados mais ricos.

## Dynamic Renderer

O dynamic renderer será responsável por transformar schema em interface renderizada.

Responsabilidades:

- Percorrer o schema.
- Identificar componentes.
- Resolver componentes no registry.
- Conectar campos ao React Hook Form quando estiver em contexto de formulário.
- Aplicar validações derivadas do Zod.
- Renderizar estados de erro.
- Respeitar regras de visibilidade e desabilitação quando forem introduzidas.

O renderer não deve conter regras específicas de negócio. Ele deve interpretar contratos declarativos.

## Schema-driven UI

A UI orientada por schema deve começar pequena.

Primeiros schemas devem representar:

- Formulários simples.
- Campos básicos.
- Labels.
- Ordem dos campos.
- Regras simples de obrigatoriedade.
- Valores iniciais.

Depois podem evoluir para:

- Layouts.
- Grupos.
- Abas.
- Listagens.
- Filtros.
- Ações.
- Regras condicionais.
- Permissões.

O schema deve ser tratado como contrato. Mudanças nele precisam ser versionadas quando começarem a afetar dados reais de usuários.

---

# 5. ARQUITETURA OFFLINE-FIRST

## Uso de IndexedDB com Dexie.js

O IndexedDB será usado para persistir dados locais de forma durável. O Dexie.js será usado para simplificar acesso, consultas, versionamento local do banco e organização das tabelas.

A camada Dexie deve ficar isolada do restante da aplicação. Componentes React não devem acessar IndexedDB diretamente. O acesso deve passar por serviços ou stores apropriadas.

## Estrutura de dados local

Cada domínio sincronizável deve possuir dados, metadados de versão e fila de pendências.

Exemplo conceitual:

```json
{
  "data": [],
  "version": 1,
  "lastSync": 1710000000000,
  "pending": []
}
```

Significado:

- `data`: registros disponíveis localmente.
- `version`: versão conhecida pelo cliente para aquele conjunto de dados.
- `lastSync`: timestamp da última sincronização concluída.
- `pending`: operações locais ainda não confirmadas pelo servidor.

Esse formato é conceitual. A modelagem final pode ser normalizada em tabelas Dexie separadas para dados, metadados e pendências.

## Fluxo offline-first

O fluxo padrão da aplicação deve ser:

1. Carregar dados locais do IndexedDB.
2. Renderizar a interface imediatamente com os dados locais.
3. Detectar conectividade.
4. Sincronizar em background quando possível.
5. Atualizar IndexedDB com dados confirmados.
6. Atualizar a UI a partir da fonte local.

A UI deve depender primeiro da camada local. O backend deve ser visto como mecanismo de sincronização, não como requisito para cada interação do usuário.

## Alterações locais

Quando o usuário criar, editar ou excluir dados:

1. A alteração deve ser gravada localmente.
2. Uma operação deve ser adicionada à fila `pending`.
3. A UI deve refletir a alteração.
4. O sync engine deve tentar enviar a operação ao servidor quando possível.
5. Após confirmação, a operação pendente deve ser removida ou marcada como concluída.

## Service Worker e PWA

O Service Worker com Workbox deve ser responsável por:

- Cachear o shell da aplicação.
- Permitir carregamento após o primeiro acesso.
- Controlar estratégia de cache para assets estáticos.
- Trabalhar em conjunto com IndexedDB para dados dinâmicos.

Dados de negócio não devem depender apenas do cache HTTP. Eles devem estar no IndexedDB.

---

# 6. SYNC ENGINE (DESIGN)

O sync engine será o mecanismo que mantém dados locais e servidor alinhados.

Ele deve ser desenhado como uma camada própria, não misturado com componentes React.

## Push: local para servidor

O push envia operações locais pendentes para o backend.

Exemplos de operações:

- Criar registro.
- Atualizar registro.
- Excluir registro.

Cada operação pendente deve possuir:

- Identificador local.
- Tipo da operação.
- Entidade afetada.
- Payload.
- Versão local conhecida.
- Data de criação.
- Estado da tentativa de sync.

O push deve ser idempotente sempre que possível. Se o cliente reenviar a mesma operação, o servidor não deve aplicar duplicidade.

## Pull: servidor para local

O pull busca alterações remotas desde a última versão conhecida pelo cliente.

O servidor deve retornar:

- Novos registros.
- Registros alterados.
- Registros removidos ou marcados como removidos.
- Nova versão global ou por entidade.

O cliente deve aplicar essas alterações no IndexedDB e atualizar os metadados locais.

## Versionamento

O versionamento é essencial para saber o que mudou.

No início, pode existir uma estratégia simples:

- Versão incremental por entidade ou coleção.
- Campo `updatedAt` para apoio.
- Identificador único por registro.
- Controle de última versão sincronizada por cliente.

Com a evolução, o sistema pode adotar:

- Versionamento por operação.
- Log de eventos.
- Vetores de versão.
- Estratégias específicas por tipo de dado.

Essas estratégias avançadas só devem ser adotadas quando o caso de uso exigir.

## Pending queue

A pending queue é a fila local de alterações ainda não confirmadas.

Ela deve permitir:

- Persistência offline.
- Reenvio após falha.
- Controle de tentativas.
- Marcação de erro.
- Diagnóstico manual em caso de conflito.

Ela não deve ser apenas memória em Zustand. Precisa ser persistida no IndexedDB.

## Conflitos

No início, conflitos podem ser tratados de forma conservadora:

- Detectar conflito.
- Impedir sobrescrita silenciosa.
- Registrar estado de conflito.
- Exigir resolução manual ou regra clara.

Não implementar resolução automática complexa até que os tipos de dados e os fluxos reais estejam mais maduros.

---

# 7. BACKEND (NESTJS)

## Arquitetura modular

O backend deve ser organizado por módulos claros.

Módulos iniciais sugeridos:

- Health ou status.
- Auth futuramente.
- Users futuramente.
- Schemas futuramente.
- Records ou entidades de dados.
- Sync.

Cada módulo deve conter apenas o necessário para sua responsabilidade:

- Controller.
- Service.
- DTOs.
- Integração com Prisma quando aplicável.

## Endpoints com versionamento

As APIs devem ser versionadas desde o início.

Exemplo conceitual de organização:

- `/api/v1/...`

Isso permite evoluir contratos sem quebrar clientes antigos, especialmente importante em aplicações offline, onde usuários podem ficar algum tempo sem atualizar o app.

## Integração com Prisma

O Prisma deve centralizar o acesso ao PostgreSQL.

Boas práticas:

- Não espalhar queries brutas sem necessidade.
- Manter migrations sob controle.
- Usar DTOs e validação no limite da API.
- Manter regras de negócio no service, não no controller.
- Evitar acoplamento direto entre formato do banco e formato da UI.

## Suporte futuro a schema dinâmico

O backend deverá evoluir para armazenar schemas de:

- Entidades.
- Campos.
- Formulários.
- Listagens.
- Filtros.
- Ações.
- Validações.

Essa capacidade deve ser introduzida em fases. A primeira versão deve validar o fluxo com schemas controlados pelo desenvolvedor antes de permitir criação dinâmica pelo usuário final.

---

# 8. LOW-CODE BUILDER (VISÃO FUTURA)

O low-code builder será uma camada visual construída sobre a arquitetura schema-driven.

Ele não deve ser tratado como um gerador de código. Ele deve ser um editor de schemas.

## Criação visual de tabelas

Usuários poderão criar entidades de dados visualmente.

Exemplos:

- Cliente.
- Produto.
- Pedido.
- Atendimento.
- Tarefa.

Cada entidade será traduzida para uma definição estruturada no sistema.

## Definição de colunas

O usuário poderá definir campos como:

- Texto.
- Número.
- Data.
- Booleano.
- Seleção.
- Relacionamento.
- Anexo futuramente.

Cada campo deve possuir metadados:

- Nome interno.
- Label.
- Tipo.
- Obrigatoriedade.
- Valor padrão.
- Regras de validação.
- Opções quando aplicável.

## Geração automática de formulários

A partir da entidade e seus campos, o sistema poderá gerar formulários automaticamente.

O usuário poderá ajustar:

- Ordem dos campos.
- Agrupamentos.
- Campos visíveis.
- Campos obrigatórios.
- Textos auxiliares.
- Regras condicionais.

## Listagens e filtros

O builder deverá permitir configurar:

- Colunas visíveis.
- Ordem de exibição.
- Filtros padrão.
- Busca.
- Ordenação.
- Ações por linha.
- Estados vazios.

## Interações entre campos

Em fases futuras, o sistema deve suportar:

- Exibir campo com base em outro campo.
- Tornar campo obrigatório condicionalmente.
- Calcular valores simples.
- Filtrar opções de um campo com base em outro.
- Bloquear edição em determinados estados.

Essas regras devem ser declarativas e versionadas.

---

# 9. ESTRATÉGIA DE DESENVOLVIMENTO (CRÍTICO)

O projeto deve ser desenvolvido em etapas pequenas.

Cada etapa deve ser:

- Independente.
- Testável.
- Simples.
- Revisável.
- Com critério de conclusão claro.

Não avançar para uma etapa maior sem validar a etapa anterior.

O objetivo é reduzir risco técnico, principalmente nas áreas mais complexas:

- Renderer dinâmico.
- Offline-first.
- Sincronização.
- Schema dinâmico.
- Futuro builder visual.

## Regra central

Construir primeiro uma versão simples e funcional do caminho completo:

1. Renderizar uma tela simples.
2. Salvar dados localmente.
3. Listar dados localmente.
4. Sincronizar com backend.
5. Evoluir schemas.
6. Só depois avançar para builder visual.

## O que evitar

Evitar:

- Criar o builder visual antes de existir renderer estável.
- Criar sync avançado antes de ter CRUD simples.
- Criar schema dinâmico no banco antes de validar schemas em arquivo.
- Criar muitas abstrações antes de haver repetição real.
- Misturar offline, backend e UI em uma única etapa grande.

## Testes manuais por etapa

Cada etapa deve incluir uma forma simples de validação manual, por exemplo:

- Abrir tela.
- Preencher formulário.
- Validar erro.
- Recarregar página.
- Desligar conexão.
- Criar registro offline.
- Restaurar conexão.
- Confirmar sincronização.

---

# 10. LISTA DE ETAPAS (ROADMAP)

## Etapa 1 - Base do repositório

Objetivo:
Criar a estrutura inicial do projeto fullstack.

Escopo:
Definir organização de frontend, backend, configurações TypeScript e padrões básicos de pastas.

Critério de conclusão:
O projeto deve abrir no editor com estrutura clara e sem implementação funcional complexa.

---

## Etapa 2 - Frontend mínimo

Objetivo:
Subir uma aplicação React com TypeScript.

Escopo:
Configurar React, TypeScript e Tailwind CSS com uma tela inicial simples.

Critério de conclusão:
A aplicação frontend deve iniciar localmente e renderizar uma tela básica.

---

## Etapa 3 - Backend mínimo

Objetivo:
Subir uma API NestJS funcional.

Escopo:
Criar aplicação NestJS com endpoint simples de status.

Critério de conclusão:
Uma rota de health/status deve responder corretamente.

---

## Etapa 4 - Banco e Prisma

Objetivo:
Conectar backend ao PostgreSQL usando Prisma.

Escopo:
Configurar Prisma, conexão com banco e primeira migration simples.

Critério de conclusão:
O backend deve conseguir executar uma consulta simples no banco.

---

## Etapa 5 - Design system básico

Objetivo:
Criar a base visual reutilizável.

Escopo:
Criar componentes básicos como botão, input, mensagem de erro e layout simples.

Critério de conclusão:
Uma tela deve usar apenas componentes da biblioteca inicial.

---

## Etapa 6 - React Hook Form

Objetivo:
Padronizar formulários.

Escopo:
Criar um formulário simples usando React Hook Form.

Critério de conclusão:
O formulário deve capturar valores e exibir estado de erro básico.

---

## Etapa 7 - Validação com Zod

Objetivo:
Adicionar validação estruturada.

Escopo:
Integrar Zod ao formulário existente.

Critério de conclusão:
Campos inválidos devem exibir erros previsíveis e tipados.

---

## Etapa 8 - Estado global com Zustand

Objetivo:
Introduzir estado global de forma controlada.

Escopo:
Criar uma store pequena para estado de aplicação, sem misturar dados persistidos.

Critério de conclusão:
Uma informação global simples deve ser lida e alterada por componentes diferentes.

---

## Etapa 9 - Primeiro schema de formulário

Objetivo:
Representar um formulário por schema.

Escopo:
Criar um schema controlado pelo desenvolvedor para um formulário simples.

Critério de conclusão:
O schema deve descrever campos, labels e obrigatoriedade sem gerar HTML como string.

---

## Etapa 10 - Component registry inicial

Objetivo:
Mapear tipos de campo para componentes React.

Escopo:
Criar registry com poucos tipos iniciais, como texto, número e seleção.

Critério de conclusão:
O sistema deve conseguir resolver um tipo de campo para um componente real.

---

## Etapa 11 - Dynamic renderer inicial

Objetivo:
Renderizar formulário a partir de schema.

Escopo:
Criar renderer simples que percorre o schema e usa o registry.

Critério de conclusão:
Um formulário deve aparecer na tela usando apenas schema e registry.

---

## Etapa 12 - Renderer com React Hook Form

Objetivo:
Conectar o renderer ao controle de formulário.

Escopo:
Integrar campos renderizados dinamicamente ao React Hook Form.

Critério de conclusão:
O formulário dinâmico deve submeter dados corretamente.

---

## Etapa 13 - Renderer com validação Zod

Objetivo:
Validar formulários dinâmicos.

Escopo:
Gerar ou associar validações Zod ao schema controlado.

Critério de conclusão:
Campos dinâmicos inválidos devem exibir erros corretamente.

---

## Etapa 14 - Dexie inicial

Objetivo:
Adicionar persistência local.

Escopo:
Configurar Dexie.js com uma tabela local simples.

Critério de conclusão:
A aplicação deve salvar e ler registros no IndexedDB.

---

## Etapa 15 - CRUD local simples

Objetivo:
Permitir criação e listagem local.

Escopo:
Usar formulário dinâmico para criar registros e uma lista simples para exibi-los.

Critério de conclusão:
O usuário deve criar um registro, recarregar a página e ver o registro persistido.

---

## Etapa 16 - Estrutura de metadados offline

Objetivo:
Preparar dados locais para sincronização.

Escopo:
Adicionar metadados locais como versão, lastSync e pending queue.

Critério de conclusão:
Cada alteração local deve registrar metadados suficientes para sync futuro.

---

## Etapa 17 - Pending queue local

Objetivo:
Registrar operações pendentes.

Escopo:
Ao criar ou editar dados localmente, gravar uma operação na fila pending.

Critério de conclusão:
A fila deve sobreviver ao reload da página.

---

## Etapa 18 - PWA básico

Objetivo:
Transformar o frontend em PWA instalável.

Escopo:
Configurar manifest, ícones básicos e Service Worker com Workbox.

Critério de conclusão:
A aplicação deve ser reconhecida pelo navegador como PWA.

---

## Etapa 19 - Cache do app shell

Objetivo:
Permitir abertura offline após primeiro carregamento.

Escopo:
Configurar cache dos assets essenciais da aplicação.

Critério de conclusão:
Após primeiro acesso, a aplicação deve abrir sem conexão.

---

## Etapa 20 - API de entidade simples

Objetivo:
Persistir registros no servidor.

Escopo:
Criar endpoint versionado para criar e listar uma entidade simples.

Critério de conclusão:
O backend deve criar e listar registros no PostgreSQL.

---

## Etapa 21 - Push inicial

Objetivo:
Enviar pendências locais para o servidor.

Escopo:
Implementar fluxo conceitual de envio das operações da pending queue.

Critério de conclusão:
Registros criados localmente devem chegar ao backend quando houver conexão.

---

## Etapa 22 - Confirmação de pendências

Objetivo:
Marcar operações sincronizadas.

Escopo:
Após sucesso no push, atualizar a fila pending local.

Critério de conclusão:
Operações confirmadas não devem ser reenviadas indefinidamente.

---

## Etapa 23 - Pull inicial

Objetivo:
Buscar alterações do servidor.

Escopo:
Criar endpoint e fluxo de busca de registros remotos.

Critério de conclusão:
Dados criados no servidor devem aparecer localmente após sincronização.

---

## Etapa 24 - Versionamento simples

Objetivo:
Controlar o que já foi sincronizado.

Escopo:
Adicionar versão incremental ou timestamp de sincronização por entidade.

Critério de conclusão:
O cliente deve buscar apenas alterações relevantes desde a última sincronização conhecida.

---

## Etapa 25 - Estado visual de sincronização

Objetivo:
Dar feedback ao usuário.

Escopo:
Exibir estados como sincronizando, offline, pendente e erro de sync.

Critério de conclusão:
O usuário deve entender se há dados pendentes ou falha de sincronização.

---

## Etapa 26 - Tratamento básico de erro de sync

Objetivo:
Evitar perda silenciosa de dados.

Escopo:
Registrar falhas de envio ou recebimento e manter pendências preservadas.

Critério de conclusão:
Falhas não devem apagar dados locais nem remover pendências sem confirmação.

---

## Etapa 27 - Listagem schema-driven

Objetivo:
Representar listagens por schema.

Escopo:
Criar schema simples para colunas, labels e campos exibidos.

Critério de conclusão:
Uma listagem deve ser renderizada com base em schema controlado.

---

## Etapa 28 - Filtros básicos

Objetivo:
Adicionar filtros simples às listagens.

Escopo:
Permitir busca ou filtro local em dados já armazenados.

Critério de conclusão:
O usuário deve filtrar registros locais sem depender do backend.

---

## Etapa 29 - Schema armazenado no backend

Objetivo:
Começar a mover schemas para persistência remota.

Escopo:
Criar estrutura simples para salvar e carregar schemas controlados.

Critério de conclusão:
O frontend deve conseguir carregar um schema vindo da API e renderizar a tela.

---

## Etapa 30 - Versionamento de schema

Objetivo:
Preparar evolução segura de schemas.

Escopo:
Adicionar versão aos schemas e validar compatibilidade básica.

Critério de conclusão:
O sistema deve identificar qual versão de schema está sendo usada.

---

## Etapa 31 - Protótipo de editor de schema

Objetivo:
Criar a primeira interface interna de configuração.

Escopo:
Permitir editar campos simples de um schema em uma tela administrativa.

Critério de conclusão:
Um usuário técnico deve alterar label ou ordem de campos e ver reflexo na renderização.

---

## Etapa 32 - Builder visual inicial

Objetivo:
Iniciar a evolução para low-code.

Escopo:
Criar interface visual mínima para adicionar campos a um formulário.

Critério de conclusão:
Um campo criado visualmente deve aparecer no formulário renderizado por schema.

---

## Etapa 33 - Regras condicionais simples

Objetivo:
Adicionar comportamento declarativo entre campos.

Escopo:
Permitir regra simples de visibilidade baseada em valor de outro campo.

Critério de conclusão:
Um campo deve aparecer ou sumir conforme valor de outro campo.

---

## Etapa 34 - Permissões básicas

Objetivo:
Preparar controle de acesso.

Escopo:
Definir estrutura inicial para permissões por tela ou ação.

Critério de conclusão:
O sistema deve conseguir ocultar ou bloquear uma ação com base em permissão simples.

---

## Etapa 35 - Revisão arquitetural

Objetivo:
Reavaliar decisões antes de expandir o builder.

Escopo:
Revisar component library, registry, renderer, offline layer, sync engine e backend.

Critério de conclusão:
Problemas estruturais devem estar documentados e priorizados antes da próxima fase.

---

# 11. REGRAS DE EXECUÇÃO COM O CODEX

Estas regras devem ser seguidas durante todo o desenvolvimento assistido pelo Codex.

## Não avançar automaticamente

O Codex não deve avançar automaticamente para a próxima etapa do roadmap.

Após concluir uma etapa:

- Informar o que foi feito.
- Informar quais arquivos foram alterados.
- Explicar como testar.
- Aguardar validação do usuário antes de iniciar a próxima etapa.

## Trabalhar em pequenas entregas

Cada entrega deve corresponder a uma etapa pequena ou a uma parte claramente delimitada de uma etapa.

Não misturar:

- Frontend e backend complexos na mesma entrega.
- Offline e sync completo na mesma entrega.
- Builder visual e renderer base na mesma entrega.
- Refatorações grandes com novas funcionalidades.

## Não poluir o contexto

O Codex deve manter o foco na etapa atual.

Evitar:

- Explicações longas sem necessidade.
- Criar arquivos não solicitados.
- Adicionar bibliotecas sem justificar.
- Refatorar áreas fora do escopo.
- Antecipar funcionalidades futuras.

## Sempre explicar antes de codar

Antes de implementar uma etapa, o Codex deve explicar brevemente:

- O objetivo da etapa.
- Quais arquivos ou áreas serão afetados.
- Qual abordagem será usada.
- Como a entrega será testada.

## Sempre explicar como testar

Toda entrega deve terminar com instruções de teste manual.

As instruções devem ser específicas, por exemplo:

- Qual comando rodar.
- Qual URL abrir.
- Qual fluxo executar.
- Qual resultado esperado.

## Preservar simplicidade

Se houver duas soluções possíveis, escolher a mais simples que atenda ao requisito atual e não bloqueie a evolução planejada.

## Não implementar além do combinado

O Codex deve evitar adicionar recursos extras. Melhor terminar uma etapa pequena corretamente do que entregar várias partes acopladas e difíceis de revisar.

---

# 12. RISCOS E ARMADILHAS

## Excesso de abstração

Risco:
Criar uma plataforma genérica demais antes de validar os casos reais.

Impacto:
O projeto fica difícil de entender, testar e modificar.

Mitigação:
Começar com schemas pequenos, componentes concretos e evolução incremental.

## Complexidade do offline

Risco:
Tratar offline como cache simples.

Impacto:
Perda de dados, inconsistência, bugs difíceis de reproduzir e experiência ruim sem conexão.

Mitigação:
Modelar IndexedDB, metadados, pending queue e sync engine como partes centrais da arquitetura.

## Conflitos de sincronização

Risco:
Duas fontes alterarem o mesmo dado antes da sincronização.

Impacto:
Sobrescrita indevida ou perda de atualização.

Mitigação:
Controlar versões, detectar conflito e evitar resolução automática prematura.

## Schema dinâmico no banco

Risco:
Criar uma modelagem dinâmica complexa cedo demais.

Impacto:
Consultas difíceis, validações frágeis, migrations confusas e baixa performance.

Mitigação:
Começar com entidades estáveis e schemas controlados, depois evoluir para persistência dinâmica.

## Builder visual prematuro

Risco:
Construir a interface de builder antes de estabilizar renderer, registry e schema.

Impacto:
O builder fica acoplado a decisões instáveis e precisa ser refeito.

Mitigação:
Validar primeiro a renderização por schema e só depois criar ferramentas visuais.

## Duplicação de componentes

Risco:
Criar componentes específicos para cada tela.

Impacto:
O renderer dinâmico perde valor e a plataforma fica inconsistente.

Mitigação:
Centralizar componentes reutilizáveis na component library.

## Misturar regras de negócio no renderer

Risco:
Colocar lógica específica de domínio dentro do dynamic renderer.

Impacto:
O renderer deixa de ser genérico e fica difícil de reutilizar.

Mitigação:
Manter regras de domínio em services, schemas ou camadas específicas.

## Falta de critérios de conclusão

Risco:
Etapas abertas demais gerarem progresso aparente sem validação real.

Impacto:
Acúmulo de débito técnico e retrabalho.

Mitigação:
Toda etapa deve ter objetivo, escopo e critério de conclusão.

---

# 13. EVOLUÇÕES FUTURAS

## Multi-tenant

Permitir que múltiplas organizações usem a mesma plataforma com isolamento de dados.

Pontos futuros:

- Separação por tenant.
- Configurações por organização.
- Schemas específicos por tenant.
- Políticas de acesso por tenant.

## Controle de permissões

Adicionar um sistema de permissões mais completo.

Possibilidades:

- Papéis.
- Permissões por entidade.
- Permissões por campo.
- Permissões por ação.
- Permissões por tela.

## Builder visual completo

Evoluir o protótipo para um builder completo.

Recursos possíveis:

- Editor visual de formulários.
- Editor de listagens.
- Editor de filtros.
- Editor de regras condicionais.
- Pré-visualização em tempo real.
- Publicação de versões.

## Sync avançado

Evoluir a sincronização para cenários mais complexos.

Possibilidades:

- Resolução assistida de conflitos.
- Histórico de alterações.
- Log de operações.
- Estratégias por entidade.
- Sincronização parcial.
- Priorização de dados críticos.

## Auditoria

Adicionar rastreabilidade de operações importantes.

Possibilidades:

- Quem criou.
- Quem alterou.
- Quando alterou.
- Qual valor mudou.
- Origem da alteração.

## Relacionamentos dinâmicos

Permitir que entidades criadas no builder se relacionem.

Possibilidades:

- Um para muitos.
- Muitos para muitos.
- Campos de referência.
- Filtros baseados em relacionamento.

## Importação e exportação

Permitir entrada e saída de dados por arquivos.

Possibilidades:

- CSV.
- Excel.
- JSON.
- Templates de importação.
- Validação antes de importar.

## Automação de fluxos

Adicionar automações configuráveis.

Possibilidades:

- Ações disparadas por mudança de campo.
- Notificações.
- Criação automática de registros.
- Atualização de status.
- Integrações externas.

---

# Encerramento

Este guia deve ser tratado como a referência principal do projeto.

O desenvolvimento deve sempre priorizar:

- Entregas pequenas.
- Validação manual clara.
- Componentes reutilizáveis.
- Offline-first real.
- Schemas simples antes de schemas complexos.
- Sincronização previsível antes de sincronização avançada.
- Evolução gradual para low-code.

Nenhuma etapa futura deve justificar complexidade desnecessária na etapa atual.
