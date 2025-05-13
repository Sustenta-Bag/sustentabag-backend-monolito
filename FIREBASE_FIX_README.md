# Firebase Error Fix

Este guia ajudará a resolver o erro `FirebaseError: Firebase: Error (auth/invalid-api-key)` no container Docker.

## Problema

O erro `auth/invalid-api-key` ocorre porque as variáveis de ambiente do Firebase não estavam sendo corretamente passadas para o container Docker.

## Mudanças realizadas

1. Modificado o `docker-compose.yml` para:
   - Usar o arquivo `.env` com `env_file`
   - Incluir explicitamente as variáveis do Firebase no ambiente do container

2. Atualizado o `.dockerignore` para não ignorar o arquivo `.env`

3. Adicionado logs e validação no `FirebaseService.js` para:
   - Detectar problemas com chaves de API ausentes
   - Fornecer mensagens de erro mais claras
   - Permitir que o sistema continue funcionando mesmo sem Firebase

4. Atualizado o Dockerfile para verificar as variáveis de ambiente no startup

## Como testar as mudanças

1. **Pare e remova os containers existentes**:
   ```bash
   docker-compose down
   ```

2. **Reconstrua a imagem da API**:
   ```bash
   docker-compose build api
   ```

3. **Inicie os serviços novamente**:
   ```bash
   docker-compose up -d
   ```

4. **Verifique os logs do container para confirmar que ele está lendo as variáveis de ambiente corretamente**:
   ```bash
   docker-compose logs api
   ```

5. **Execute o script de teste do Firebase para verificar a conexão**:
   ```bash
   docker-compose exec api node src/scripts/test-firebase-config.js
   ```

## Resolução de problemas

Se o erro persistir, verifique:

1. **Se o arquivo .env contém valores válidos para todas as variáveis do Firebase**
2. **Se o Firebase API Key está correto e ativo no console do Firebase**
3. **Se as permissões do Firebase estão configuradas corretamente**

## Testando fora do Docker

Para testar a conexão com o Firebase localmente:
```bash
node src/scripts/test-firebase-config.js
```

## Contato

Se precisar de assistência adicional, entre em contato com o administrador do sistema.
