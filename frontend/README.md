# Manga & Anime Community - README (ITALIANO)

<!-- Descrizione del Progetto -->
Il progetto è un social network dedicato agli appassionati di manga e anime, progettato per favorire la creazione di una community dove gli utenti possano condividere interessi, postare opinioni, e creare una libreria personalizzata di anime e manga. La piattaforma offre varie funzionalità social e di gestione dei contenuti per migliorare l’esperienza di condivisione.

<!-- Funzionalità Principali -->
1. # Registrazione e Login
Gli utenti possono registrarsi attraverso il sito o tramite il login di Google.
Dopo l’accesso, l’utente viene reindirizzato alla homepage dove può interagire con i contenuti pubblicati.
2. # Homepage
Feed dei Post: Gli utenti possono visualizzare i post propri e degli altri utenti, ordinati dal più recente al meno recente.
Creazione e Gestione dei Post:
Gli utenti possono creare nuovi post.
I proprietari del post possono modificare o cancellare i propri post.
<!-- Commenti e Reazioni: -->
Gli utenti possono commentare e aggiungere reazioni (like e dislike) ai post.
Vengono mostrati solo i primi tre commenti sotto ogni post, con la possibilità di espandere la lista tramite un bottone per visualizzare gli altri commenti.
3. # Pagina Dettagli Post
In questa sezione, è possibile visualizzare un singolo post cliccato dall’homepage.
Gestione Commenti: L’utente può aggiungere, modificare o cancellare i commenti di cui è proprietario.
4. # Sezione Libreria
La sezione contiene una Library globale che mostra una lista di anime e manga disponibili per tutti gli utenti.
Aggiunta alla Libreria Personale:
Gli utenti possono aggiungere elementi della Library alla propria libreria personale (MyLibrary).
Dopo l’aggiunta, il bottone per aggiungere scompare, evitando duplicati.
Aggiunta di Nuovi Elementi:
Se l’utente non trova un anime o manga specifico, può aggiungerlo alla Library globale attraverso un form, che diventa disponibile se l’elemento non è già presente.
5. # Pagina MyLibrary
Gli elementi aggiunti dall’utente nella Library vengono salvati in MyLibrary, una libreria personalizzata.
Funzione Privacy:
L’utente può impostare la privacy su ciascun elemento della propria libreria, rendendolo invisibile ai visitatori esterni.
Quando un utente visita la libreria di un altro utente, gli elementi con privacy impostata non sono visibili.

<!-- Tecnologie e Dipendenze -->
# Backend
Node.js e Express: per la gestione delle richieste e la costruzione dell'API REST.
bcrypt: hashing delle password per la sicurezza degli utenti.
cloudinary e multer-storage-cloudinary: per la gestione e archiviazione delle immagini su Cloudinary.
cors: per la gestione della condivisione delle risorse tra domini.
dotenv: gestione delle variabili d’ambiente.
helmet: per una maggiore sicurezza dell'app Express.
jsonwebtoken e jwt-decode: per la generazione e la gestione dei token JWT per l'autenticazione.
mongoose: per la connessione e gestione del database MongoDB.
passport e passport-google-oauth20: per l’autenticazione OAuth 2.0 con Google.
nodemailer e mailtrap: per l’invio di email (es. conferma registrazione).
# Frontend
React con React Router DOM: per la costruzione dell’interfaccia e la navigazione tra le pagine.
Bootstrap e React-Bootstrap: per lo stile e i componenti UI.
react-toastify: per le notifiche toast per un feedback immediato agli utenti.
draftjs-to-html e react-draft-wysiwyg: per la formattazione e gestione dei post con testo avanzato.
@fortawesome/fontawesome-free: per le icone e l’estetica dell'interfaccia.
# Strumenti di Sviluppo
nodemon: per l’aggiornamento automatico del server in fase di sviluppo.

<!-- Istruzioni per l'Uso -->
Registrazione e Login: Accedere al sito tramite registrazione o login Google.
Interazione con i Post: Creare, modificare o cancellare post e commentare.
Gestione Libreria: Aggiungere elementi alla MyLibrary, cercare nella Library e impostare privacy sugli elementi.
Conclusioni
Questo progetto vuole essere una piattaforma social pensata per appassionati di anime e manga, con focus sulla gestione di contenuti personalizzati e privacy.



# Manga & Anime Community - README (ENGLISH)

<!-- Project Description -->
The project is a social network dedicated to manga and anime enthusiasts, designed to create a community where users can share interests, post opinions, and build a personalized library of anime and manga. The platform provides various social and content management features to enhance the sharing experience.

<!-- Key Features -->
1. # Registration and Login
Users can register either via the website or through Google login. After logging in, users are redirected to the homepage where they can interact with published content.

2. # Homepage
Post Feed: Users can view their posts and posts from other users, ordered from most recent to oldest. Post Creation and Management:

Users can create new posts.
Post owners can edit or delete their own posts.
<!-- Comments and Reactions: -->
Users can comment on posts and add reactions (like and dislike).
Only the first three comments under each post are displayed, with the option to expand the list via a button to view additional comments.
3. # Post Detail Page
In this section, users can view a single post clicked on from the homepage.
Comment Management: Users can add, edit, or delete comments on posts they own.
4. # Library Section
This section contains a global Library displaying a list of anime and manga available to all users.
Add to Personal Library:
Users can add items from the Library to their personal library (MyLibrary).
After adding an item, the add button disappears to prevent duplicates.
Adding New Items:
If users do not find a specific anime or manga, they can add it to the global Library via a form that appears if the item is not already present.
5. # MyLibrary Page
Items added by the user from the Library are saved in MyLibrary, their personalized library.
Privacy Setting:
Users can set privacy for each item in their library, making it invisible to external visitors.
When a user visits another user’s library, items marked with privacy settings are not visible.
<!-- Technologies and Dependencies -->
# Backend
Node.js and Express: For request handling and API REST creation.
bcrypt: Password hashing for user security.
cloudinary and multer-storage-cloudinary: For image management and storage on Cloudinary.
cors: For cross-origin resource sharing management.
dotenv: Environment variable management.
helmet: Enhanced security for the Express app.
jsonwebtoken and jwt-decode: JWT token generation and management for authentication.
mongoose: Database connection and management for MongoDB.
passport and passport-google-oauth20: OAuth 2.0 authentication with Google.
nodemailer and mailtrap: For sending emails (e.g., registration confirmation).
# Frontend
React with React Router DOM: For building the user interface and navigation between pages.
Bootstrap and React-Bootstrap: For styling and UI components.
react-toastify: Toast notifications to provide immediate user feedback.
draftjs-to-html and react-draft-wysiwyg: For post formatting and advanced text management.
@fortawesome/fontawesome-free: For icons and interface aesthetics.
# Development Tools
nodemon: Automatic server refresh during development.

<!-- Usage Instructions -->
Registration and Login: Access the site via registration or Google login.
Post Interaction: Create, edit, or delete posts and comments.
Library Management: Add items to MyLibrary, search the Library, and set privacy on items.

<!-- Conclusion -->
This project aims to be a social platform for anime and manga enthusiasts, focusing on personalized content management and privacy.









# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
