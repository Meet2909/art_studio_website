# Art Studio Workshop & E-Commerce Platform

# Look at the live website -- "https://ccdartstudio.com"


A full-stack, fully responsive web application built for an art workshop client. This platform serves as a digital portfolio, an e-commerce storefront for purchasing artworks and courses, and a booking portal for corporate events. It features a custom-built admin panel for business analytics and utilizes modern UI components for an engaging, artistic user experience.

##  Key Features

* **E-Commerce & Course Enrollment:** Secure purchasing of physical art pieces and enrollment in art courses, complete with a cart system and checkout flow.
* **Admin Dashboard:** A secured, centralized hub for the client to track overall sales, monitor enrolled users, and manage platform content (artworks, courses).
* **Corporate Workshops:** A dedicated portal highlighting corporate event offerings, allowing businesses to inquire and book team-building art sessions.
* **Engaging UI/UX:** Built with a focus on aesthetics using advanced UI components (via ReactBits), including circular galleries, scroll stacks, and tilted cards to reflect the artistic nature of the brand.
* **Direct Customer Communication:** Integrated a floating WhatsApp icon for mobile and desktop, enabling seamless, direct-to-client chat support.
* **Fully Responsive Design:** Optimized for all screen sizes, ensuring the complex artistic layouts render perfectly on mobile browsers.

##  Screenshots

# Home Page
 <img width="1279" height="710" alt="image" src="https://github.com/user-attachments/assets/028977c7-3fa2-431c-8e8a-b8057f56b752" />
 
 # Art Store 
 <img width="1279" height="716" alt="image" src="https://github.com/user-attachments/assets/e15cf1cb-78ba-4015-af17-95e7d0291844" />

# Admin Dashboard
 <img width="1279" height="710" alt="image" src="https://github.com/user-attachments/assets/e48e84d3-5573-4e0b-b444-0c2eb1a0919f" /> <img width="1279" height="668" alt="image" src="https://github.com/user-attachments/assets/05f3a63f-7e91-4253-b2bd-dc0452b39a50" />

# Corporate Portal
<img width="1279" height="713" alt="image" src="https://github.com/user-attachments/assets/0d94956a-67da-423d-8ac1-b25bac5e9fcd" />
<img width="1279" height="715" alt="image" src="https://github.com/user-attachments/assets/27c3802d-3347-4316-a1bc-a470439eecdb" />


##  Tech Stack & Architecture

**Frontend (Client)**
* **Framework:** React.js (via Vite for faster HMR and optimized builds)
* **Styling:** Tailwind CSS for rapid, utility-first responsive design.
* **UI Components:** Custom animated components integrated via ReactBits.
* **State Management:** React Context / Hooks.

**Backend (Server)**
* **Environment:** Node.js with Express.js.
* **Database:** MongoDB with Mongoose ORM for structured data modeling (Users, Orders, ArtPieces, Courses).
* **Authentication:** JSON Web Tokens (JWT) for secure user sessions and Admin route protection.

**Third-Party Integrations**
* **Payment Gateway:** Razorpay integration for secure, seamless checkout of courses and artworks.
* **Media Storage:** Cloudinary for optimized image upload, delivery, and storage of art portfolios.

## 📁 Project Structure Highlights

The repository follows a clean Client/Server architecture:

```text
├── client/                 # Frontend React application (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI (Navbar, ReactBits components, FloatingWhatsApp)
│   │   ├── pages/          # Route views (AdminDashboard, ArtStore, Cart, Corporate)
│   │   └── ...
├── server/                 # Backend Express application
│   ├── models/             # Mongoose schemas (ArtPiece, Course, Order, User)
│   ├── routes/             # Express API routes (authRoutes, paymentRoutes, adminRoutes)
│   ├── middleware/         # Custom middleware (Auth verification, Error handling)
│   └── config/             # DB connection and environment configurations
