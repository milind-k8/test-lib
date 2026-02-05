# User Management CRUD Application

A React TypeScript CRUD application with a **configuration-driven form architecture** for easy extensibility. Built with Vite for fast development and JSON Server for mock API.

![React](https://img.shields.io/badge/React-19.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Vite](https://img.shields.io/badge/Vite-7.x-purple)

## ✨ Features

- **CRUD Operations**: Create, Read, Update, Delete users
- **Form Validation**: Built-in validation for all fields
- **Extensible Architecture**: Add new fields with minimal code changes
- **Modern UI**: Clean, responsive design with loading states
- **TypeScript**: Full type safety throughout

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd butler

# Install dependencies
npm install
```

### Running the Application

You need to run both the development server and the mock API:

**Terminal 1 - Start the React app:**
```bash
npm run dev
```

**Terminal 2 - Start the mock API:**
```bash
npm run server
```

Or run both simultaneously:
```bash
npm run dev:all
```

The app will be available at `http://localhost:5173`

## 🔧 How to Add New Fields

The application uses a **configuration-driven architecture**. Adding new fields requires **only 2 steps**:

### Step 1: Update the Form Configuration

Edit `src/config/userFormConfig.ts`:

```typescript
// Add your new field to the array
export const userFormConfig: FieldConfig[] = [
  // ... existing fields ...
  
  // Example: Adding Date of Birth
  {
    name: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    required: false,
    validation: { maxDate: 'today' }
  },
  
  // Example: Adding Address
  {
    name: 'address',
    label: 'Address',
    type: 'textarea',
    required: false,
    placeholder: 'Enter full address',
    rows: 3
  }
];
```

### Step 2 (Optional): Update TypeScript Types

If using strict types, update `src/types/user.ts`:

```typescript
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth?: string;  // Add new field
  address?: string;      // Add new field
  [key: string]: string | undefined;
}
```

**That's it!** No changes needed to:
- Form components ✓
- API service ✓  
- User list/table ✓
- Validation logic ✓

### Supported Field Types

| Type | Description |
|------|-------------|
| `text` | Standard text input |
| `email` | Email with validation |
| `tel` | Phone number |
| `number` | Numeric input |
| `date` | Date picker |
| `select` | Dropdown (requires `options`) |
| `textarea` | Multi-line text |

### Validation Options

```typescript
validation: {
  minLength: 2,          // Minimum characters
  maxLength: 50,         // Maximum characters
  min: 0,                // Minimum number value
  max: 100,              // Maximum number value
  pattern: 'email',      // Built-in: 'email', 'phone', 'url', 'alpha'
  maxDate: 'today',      // For date fields
}
```

## 📁 Project Structure

```
src/
├── components/
│   ├── DynamicForm/      # Schema-driven form components
│   ├── UserList/         # User table/list view
│   └── ui/               # Reusable UI components
├── config/
│   └── userFormConfig.ts # ⭐ Form field configuration
├── services/
│   └── userService.ts    # API integration
├── hooks/
│   └── useUsers.ts       # User CRUD hook
├── types/
│   └── user.ts           # TypeScript definitions
└── utils/
    └── validation.ts     # Validation utilities
```

## 🔌 API Configuration

By default, the app expects the API at `http://localhost:3001/users`.

To change the API URL, create a `.env` file:

```env
VITE_API_URL=https://your-api-url.com/users
```

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
npm run build
# Upload the dist/ folder to Netlify
```

## 🎨 Design Decisions

1. **Configuration-Driven Forms**: Single source of truth for form fields enables easy extensibility
2. **TypeScript**: Full type safety for better developer experience
3. **Vanilla CSS**: Maximum flexibility without external dependencies
4. **JSON Server**: Realistic REST API simulation for development
5. **Custom Hooks**: Encapsulated state management for CRUD operations

## 📝 License

MIT
