# Trullo

### Användarregistrering och Inloggning

- **Registrering**: Användare kan registrera sig genom att ange sina uppgifter som namn, e-post och lösenord. Vid registrering skapas en ny användare i databasen, och en JWT-token genereras för autentisering.

- **Inloggning**: Användare kan logga in genom att skapa ett konto med med sin valda e-postadress och lösenord. Vid en lyckad inloggning returneras en JWT-token som används för att skydda privata rutter.

### Uppgiftshantering

- **Skapa uppgifter**: Användare kan skapa nya uppgifter och tilldela dem till specifika projekt. Varje uppgift har fält som titel, beskrivning, status, och tidsstämplar för skapande och slutförande.

- **Uppdatera uppgifter**: Användare kan uppdatera befintliga uppgifter för att ändra deras status, beskrivning eller andra attribut.

- **Hämta uppgifter**: Användare kan hämta en lista över alla sina uppgifter eller en specifik uppgift genom att ange dess ID.

- **Ta bort uppgifter**: Användare har möjlighet att ta bort uppgifter som inte längre behövs.

Här är en uppdatering av ditt dokument som inkluderar information om routes och rollbaserad åtkomst i Trullo:

Trullo
Användarregistrering och Inloggning
Registrering: Användare kan registrera sig genom att ange namn, e-post och lösenord. Vid registrering skapas en ny användare i databasen, och en JWT-token genereras för autentisering.

Inloggning: Användare kan logga in genom att ange e-postadress och lösenord. Vid lyckad inloggning returneras en JWT-token som används för att skydda privata rutter.

### Rollbaserad Åtkomstkontroll

I Trullo finns två roller:

1. **Admin:** Har full tillgång till systemet och kan hantera alla användare och uppgifter.

2. **User:** Kan endast hantera sina egna uppgifter och uppdatera sin egen profil.

### Säkerhet och Åtkomstkontroll

- **JWT-autentisering**: Applikationen använder JWT för att autentisera användare. Endast autentiserade användare kan utföra skyddade operationer, som att skapa, uppdatera eller ta bort uppgifter.

- **Rollbaserad åtkomst**: Administratörer har fler behörigheter jämfört med vanliga användare, vilket gör det möjligt för dem att hantera vilka uppgifter som kan tas bort (har ej lagt till mer just nu).

- **Övriga säkerhetsåtgärder**: Lösenord hanteras säkert genom att de hashas och aldrig visas i databasen. Applikationen har även olika felmeddelanden beroende på om den körs i produktions- eller utvecklingsläge, vilket ger bättre insikter och säkerhet för användarna.

#### **Säkerhetspaket**:

- **helmet:** Används för att öka säkerheten i HTTP-headers. Det skyddar mot flera sårbarheter som XSS, Clickjacking och MIME-typ sniffing.

- **express-rate-limit:** Implementerar hastighetsbegränsning för att skydda API
  från brute force-attacker genom att begränsa antalet förfrågningar en användare kan göra under en viss tidsperiod.

  - **express-mongo-sanitize:** Används för att sanera data och skydda mot NoSQL-query-injektioner.

- Lösenord hashas med bcryptjs och sparas aldrig i klartext i databasen.

#### Bonus

- Jag har även inkluderat min config.env i .gitignore, men följ stegen nedan i _Kom igång med projektet_ eller kontakta mig om något fel inträffar.

### Felhantering

Fel hanteras genom att fånga okontrollerade undantag och databaskopplingsfel med process.exit för att stänga ner applikationen vid kritiska fel.

### E-postfunktionalitet

Applikationen inkluderar e-postfunktioner som skickar återställningslänkar till användare via nodemailer (kommer till mailto.io, uppdatera till din egna mailtrap.io i config.env för kunna se mailet för återställa lösenord). Detta görs genom att skicka e-postmeddelanden med viktiga upplysningar.

### Sammanfattning

Genom att kombinera dessa funktioner erbjuder Trullo en intuitiv och säker plattform för projektledning, där användare kan enkelt hantera sina uppgifter och samarbeta i olika projekt.

## Kom igång med projektet

För att komma igång med projektet, följ dessa steg efter att du har klonat det till din dator:

1. **Skapa en konfigurationsfil:**

   - Skapa en fil med namnet `config.env` i root-mappen av projektet.

2. **Lägg till nödvändig konfiguration:**

   - Om du inte redan har ett konto, registrera dig på [Mailtrap](https://www.mailtrap.io) för att kunna ta emot e-postmeddelanden. Uppdatera sedan `EMAIL_USERNAME` och `EMAIL_PASSWORD` i `config.env` med dina kontouppgifter.
   - Om du vill använda din egen MongoDB-databas, be om tillgång till min databas eller lägg in dina egna uppgifter enligt formatet nedan:

   ```plaintext
   NODE_ENV=development
   PORT=3000
   DATABASE=mongodb+srv://dittnamn:<PASSWORD>@trullo.exempel.mongodb.net/
   DATABASE_PASSWORD=databaspasswordhär

   JWT_SECRET=hemligt-pw-som-ska-vara-minst-trettiotvå-tecken
   JWT_EXPIRES_IN=1d

   EMAIL_USERNAME=de4286ad37a402
   EMAIL_PASSWORD=06d0065ef3cb2e
   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORT=2525
   ```

## Komma igång i utvecklingsläge

- Kör npm install för att hämta alla paket.

- Kör npm run typescript för att starta projektet i utvecklingsläge med TypeScript.

## Testa i produktionsläge

- Kör npm install.

- Bygg projektet med npm run build.

-Starta produktionstjänsten med npm run dist.

## Endpoints och Postman

Istället för att lista alla endpoints här, kontakta mig för en inbjudan till min Postman Collection. Där har jag redan lagt in alla endpoints och inställningar, inklusive JWT.

## Databasval

Jag har valt att använda endast MongoDB med endast REST för att fördjupa mig i MongoDB. Många andra fullstack-projekt använder MERN och MEAN-stackarna, så jag ville öka min förståelse och erfarenhet inom detta område och valde därför MongoDB som databasval.

## Konfiguration och paket

Projektet använder en config.env fil för att hantera miljövariabler, såsom databaskoppling, JWT-hemligheter och e-postinställningar.

### Paket och deras funktioner:

- bcryptjs: Används för att hasha lösenord innan de sparas i databasen.

- dotenv: Laddar miljövariabler från en .env fil till process.env.

- express: Ramverket för att bygga webbservern och hantera HTTP-förfrågningar.

- jsonwebtoken: Skapar och verifierar JWT-tokens för autentisering.

- mongoose: Hanterar databasoperationer och modeller för MongoDB.

- morgan: Logger för att se HTTP-förfrågningar i utvecklingsmiljön.

- nodemailer: Används för att skicka e-post, t.ex. lösenordsåterställningsmejl.
  validator: Validerar input som t.ex. e-postadresser. I detta projekt för kunna testa återställa lösenord utan ha giltig epost.

### Utvecklingspaket:

- cross-env: Sätter miljövariabler på ett plattformsoberoende sätt.

- nodemon: Startar om servern automatiskt vid ändringar i kod.

- ts-node och tsx: Kör TypeScript-kod direkt i utvecklingsmiljö utan att behöva kompilera till JavaScript först.
  typescript: Statiskt typningssystem för JavaScript som används för att skriva säkrare kod.

Kontakta mig om du vill veta mer!
