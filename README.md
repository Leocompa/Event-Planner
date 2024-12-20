# **Event Planner**

**Event Planner** è un'applicazione web sviluppata per aiutare gli utenti a gestire e organizzare i propri eventi in modo semplice e intuitivo. La piattaforma offre una serie di funzionalità per aggiungere, modificare, eliminare e visualizzare eventi.

---

## **Funzionalità Principali**

### **Gestione degli Eventi**
- **Visualizzazione calendario**:
  - Formati disponibili: mese, settimana, giorno e agenda.
  - Ogni evento mostra informazioni come titolo, orari e data di inizio e fine.
- **Aggiunta di eventi**:
  - Solamente gli utenti autenticati possono creare nuovi eventi con i vare dettagli disponibili (titolo, date, orari).
- **Modifica degli eventi**:
  - Seleziona un evento per visualizzarne i dettagli.
- **Eliminazione degli eventi**:
  - Cancella eventi indesiderati con una richiesta di conferma.

### **Autenticazione e Sicurezza**
- Accesso al calendario disponibile **solo per utenti registrati e autenticati**.
- Implementazione di **JWT (JSON Web Token)** per proteggere le rotte API.
- **Hashing delle password** con **bcrypt** per una gestione sicura delle credenziali.

---

## **Tecnologie Utilizzate**

### **Frontend**
- **React**: Per un'interfaccia utente dinamica e reattiva.
- **React Big Calendar**: Per la gestione e visualizzazione del calendario.
- **React-Bootstrap**: Per un design responsivo e componenti pre-stilizzati.
- **React-Datepicker**: Per una selezione delle date facile e intuitiva.
- **Axios**: Per effettuare richieste HTTP al backend.

### **Backend**
- **Node.js**: Come runtime per il server.
- **Express.js**: Per creare API RESTful robuste e modulari.
- **MongoDB**: Database NoSQL per memorizzare eventi e dati degli utenti.
- **bcrypt.js**: Per l'hashing sicuro delle password.
- **jsonwebtoken**: Per la generazione e verifica di token JWT.

### **Sicurezza**
- Hashing delle password con **bcrypt** .
- Uso di **variabili d'ambiente** per informazioni sensibili.

---

## **Sicurezza e Gestione delle Password**

- **Password sicure**:
  - Le password non vengono mai memorizzate in chiaro. 
  - Sono protette con hashing bcrypt prima di essere salvate nel database.
- **Autenticazione JWT**:
  - Dopo il login, agli utenti viene assegnato un token che autentica le loro richieste API.
  - Solo gli utenti autenticati possono aggiungere, modificare o eliminare eventi.
- **Middleware per la protezione delle rotte**:
  - Tutte le rotte API sono protette tramite middleware che verifica la validità del token JWT.

---

## **Come Configurare e Avviare l'Applicazione**

### **1. Clonare il Repository**
```bash
git clone https://github.com/Leocompa/Event-Planner
cd <repository-folder>
```

### **2. Configurare e avviare il Backend**:
  #### **2.1 Spostati nella directory del backend**:
```bash
  cd backend
```
  #### **2.2 Installa le dipendenze necessarie**:
```bash
  npm install
```
  #### **2.3 Crea un file .env nella directory principale del backend e aggiungi queste variabili d'ambiente**:
```bash
  MONGO_URI=<your-mongo-db-uri>        # URI del tuo database MongoDB
  JWT_SECRET=<your-jwt-secret-key>    # Chiave segreta per la generazione dei JWT
  BCRYPT_SALT_ROUNDS=10               # Numero di round per il salting delle password
```
  #### **2.4 Avvia il server**
```bash
  npm run dev
```
### **3. Configurare e avviare il Frontend**:
  #### **3.1 Torna alla directory principale e spostati nel frontend:**:
  ```bash
  cd ../frontend
  ```
  #### **3.2 Installa le dipendenze necessarie**:
  ```bash
  npm install
  ```
  #### **3.3 Avvia il server**
  ```bash
  npm start
  ```
### **4. Registrazione e Login**:
Apri il browser e vai su http://localhost:3000.<br>
Clicca su Register per creare un nuovo account.<br>
Effettua il Login con le credenziali appena registrate.<br>
Una volta autenticato, puoi iniziare a gestire i tuoi eventi.

---
#### **Progetto svolto da:**

| **Studente**         | **Matricola** |
|----------------------|---------------|
| Compagnucci Leonardo |    118708     |

  
