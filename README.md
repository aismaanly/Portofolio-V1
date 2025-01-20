<!-- ![Portfolio](https://image.png) -->

**Website Link:**  
<!-- [https://vercelapp](https://vercelapp)  -->

## Introduction 👋

This Portfolio is built using Next.js and Tailwind CSS for a modern design and efficient development. TypeScript is utilized for code clarity and safety. Additionally, Firebase is being integrated for backend services such as realtime-database. The outcome is a dynamic and fully functional portfolio website that highlights the developer's skill and experience.

## Tech Stack 🛠️

- [Next.js](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Firebase](https://firebase.google.com)
- [SendGrid](https://sendgrid.com)
- [Framer Motion](https://www.framer.com/motion)

## Steps to Run the Portofolio 💻

Here are the steps to run the portfolio locally.

1. **Download this project:**  

   ``` 
   git clone https://github.com/aismaanly/Portofolio_V1.git  
   ```  

2. **Install all dependencies:**  

   ```
   npm i
   ```  

3. **Run the project:**  

   ```  
   npm run dev  
   ```  

4. Create a Firebase project and select the web app

5. Create an `.env.local` file in the root directory, and add the following variables with your firebase config:

   ```
   SENDGRID_API_KEY=XXXXXXXX
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=XXXXXXXXXX
   MAIL_FROM=YOUR_MAIL_ID
   MAIL_TO=YOUR_MAIL_ID
   ```

> **Note**: `SENDGRID_API_KEY` - Create an API key from "Settings" -> "API Keys" with "Restricted Access" to only "Mail Send"

6. Create a `data.json` provided, with your data or directly import the same and edit using firebase later.

7. Import json data

   - Go to [Firebase Console](https://console.firebase.google.com) and select your project
   - Go to "Database" -> "Realtime Database" -> "Import JSON" and import the [data.json](https://github.com/aismaanly/Portofolio-V1/blob/main/data.json) file

8. Run the project

   ```bash
   npm run dev
   ```

## Deployment 🚀

1. Create a Vercel account and select "Import Project"

2. Select the repository and deploy

3. Add the following environment variables in the Vercel dashboard:
   ```
   SENDGRID_API_KEY=XXXXXXXX
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=XXXXXXXXXX
   MAIL_FROM=YOUR_MAIL_ID
   MAIL_TO=YOUR_MAIL_ID
   ```
4. The portfolio has been successfully deployed.

