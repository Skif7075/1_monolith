# Принципы организации взаимодействия микросервисов

Запуск
```bash
docker-compose up -d
```
---
## Примеры запросов

### **1. Регистрация**
```bash
curl -X POST http://localhost:3000/user/register \
  -H "Content-Type: application/json" \
  -d '{
      "first_name": "Name",
      "second_name": "LastName",
      "birthdate": "2017-02-01",
      "biography": "Some bio",
      "city": "Msk",
      "password": "pass"
    }'
```

### **2. Аутентификация**
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "id": "f9e8eab8-6814-48e6-b35b-e2a478f42e16",
    "password": "pass"
  }'
```

### **3. Получение пользователя**
```bash
curl -X GET http://localhost:3000/user/get/f9e8eab8-6814-48e6-b35b-e2a478f42e16
```

### **4. Поиск**
```bash
curl -X GET "http://localhost:3000/user/search?first_name=Nam&last_name=La"
```

### **5. Отправка сообщения**
```bash
curl -X POST http://localhost:3000/dialog/f9e8eab8-6814-48e6-b35b-e2a478f42e16/send \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "text": "Hello!"
  }'

```

### **6. Получение списка сообщений**
```bash
curl -X GET http://localhost:3000/dialog/f9e8eab8-6814-48e6-b35b-e2a478f42e16/list \
  -H "Authorization: Bearer <token>"
```
