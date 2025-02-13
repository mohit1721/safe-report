# 🛡️ [Anonymous Reporting App]([url](https://codesandbox.io/p/sandbox/github/mohit1721/safe-report))  
[A secure platform for anonymous incident reporting.]([url](https://codesandbox.io/p/sandbox/github/mohit1721/safe-report))

![image](https://github.com/user-attachments/assets/5b4216c7-7610-4a17-8056-9ec4ed0f97ff)

---

## 📋 Table of Contents  
- [🤖 Introduction](#-introduction)  
- [⚙️ Tech Stack](#-tech-stack)  
- [🔋 Features](#-features)  
- [🤸 Quick Start](#-quick-start)  
- [🕸️ Environment Setup](#-environment-setup)  
- [🚀 Deployment](#-deployment)  

---

## 🤖 Introduction  
This is a state-of-the-art **anonymous reporting system** built with **Next.js 14**, designed to provide a secure platform for reporting incidents while maintaining **complete anonymity**.

---

## ⚙️ Tech Stack  
- **Next.js 14**  
- **TypeScript**  
- **Prisma with Neon Database**  
- **NextAuth.js for Authentication**  
- **Tailwind CSS**  
- **React Hook Form**  
- **GeminiAI**  
- **BCrypt for Password Encryption**  

---

## 🔋 Features  
- **Secure Anonymous Reporting:** Ensures privacy with robust encryption.  
- **Role-Based Access:** Admin panel for report management.  
- **Real-Time Updates:** Instantly see report status changes.  
- **User Authentication:** Powered by NextAuth.js.  
- **Responsive Design:** Optimized for mobile and desktop.  
- **AI-Powered Insights:** Integrated with GeminiAI for advanced reporting.  

---

## 🤸 Quick Start  
### Prerequisites  
Make sure you have the following installed:  
- **Node.js**  
- **npm**  
- **Git**  

### Installation  
```bash
# Clone the repository
git clone <your-repo-url>
cd anonymous-reporting-system

# Install dependencies
npm install

# Set up the database
npx prisma generate
npx prisma db push

# Start the development server
npm run dev

 
## <a name="environment">🕸️ Environment Setup</a>

Create a `.env` file in the root directory with the following variables:

```env

NEXT_PUBLIC_MAPBOX_API_KEY=your-mapbox-key
DATABASE_URL=postgresql:your-database-url
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000/api/auth"
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-access-api-key


```

## <a name="deployment">🚀 Deployment</a>

The application can be easily deployed on [Vercel](https://vercel.com):

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure the environment variables
4. Deploy!
