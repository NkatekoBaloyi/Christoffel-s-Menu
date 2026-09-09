# Christoffel-s-Menu

YOUTUBE LINK:https://youtube.com/shorts/WeAf8GSkYrE

A mobile-first React prototype for managing a restaurant menu.  
Built as a self-contained UI demo with multiple screens, form validation, search/filter, and a receipt calculator.

✨ Features

- **Login screen** with email/password validation and show/hide password
- **Splash / Loading screen** with branded spinner
- **Menu Manager (Home)** – overview of dish counts by course
- **Menu List** – searchable + filterable list grouped by category (Starters / Mains / Desserts)
- **Dish Details** – view, edit, or delete a dish
- **Add / Edit Menu Item** form with validation
- **Receipt screen** – calculates subtotal, 15% VAT, and total
- Shared design system (colors, buttons, inputs) for a consistent look
- Demo navigation bar to jump between any screen instantly

  📱 Screens
Screen               |  Description
Login                |Sign-in form + “Continue to Menu” shortcut
Loading              |Branded splash screen (auto-advances)
Home                 |Restaurant overview + quick actions
Menu List            |Search, filter chips, dish cards
Dish Details         |Full dish info + Edit / Delete / View Receipt
Add / Edit Dish      |Form for creating or updating a menu item
Receipt              |Order summary with tax calculation

🛠 Tech Stack

- **React** (functional components + hooks)
- **TypeScript**
- Inline styles (no external CSS framework)
- `loremflickr.com` for placeholder dish images

  🚀 Getting Started

  ### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

# Install dependencies
npm install

# Start the development server
npm start
  
Login → Loading → Home (Menu Manager)
                     ├── View Menu → Menu List ⇄ Dish Details ⇄ Add/Edit
                     └── Add New Dish → Add/Edit form
                     
From Dish Details → Receipt

LoremFlickr. s.a. LoremFlickr: free placeholder images. [Online]. Available at: https://loremflickr.com/ [Accessed 9 September 2026].
MDN Web Docs. s.a. CSS: Cascading Style Sheets. [Online]. Available at: https://developer.mozilla.org/en-US/docs/Web/CSS [Accessed 9 September 2026].
React. s.a. React documentation. [Online]. Available at: https://react.dev/ [Accessed 9 September 2026].
South African Revenue Service (SARS). s.a. Value-added tax (VAT). [Online]. Available at: https://www.sars.gov.za/types-of-tax/value-added-tax/ [Accessed 9 September 2026].
TypeScript. s.a. TypeScript documentation. [Online]. Available at: https://www.typescriptlang.org/docs/ [Accessed 9 September 2026].
