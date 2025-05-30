# Wage Tracker

A modern, interactive wage tracker and earnings calculator built with React and TypeScript. Easily track your earnings in real time, view your earning history, and export your data. Supports dark mode, undo, change history, and more!

## Features

- **Live Wage/Earnings Calculator**: Track your earnings in real time based on hourly wage or yearly salary.
- **Dark/Light Mode**: Toggle between beautiful dark and light themes.
- **Earning History**: View a table of all your earning resets, with timestamps and total sum.
- **Change History & Undo**: See all changes, add notes, revert to previous versions, and undo actions.
- **Multi-Select & Delete**: Select and delete multiple earning history entries at once.
- **Export as CSV**: Download your earning history as a CSV file.
- **Persistent Data**: All data is saved locally in your browser.
- **Responsive UI**: Works great on desktop and mobile.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Wage_App.git
   cd Wage_App
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

### Running Locally
Start the development server:
```bash
npm start
```
- Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
Create an optimized production build:
```bash
npm run build
```
- The build output will be in the `build/` directory.

## Deploying as a Web App (GitHub Pages Example)
1. Install the GitHub Pages package:
   ```bash
   npm install --save gh-pages
   ```
2. Add the following to your `package.json`:
   ```json
   "homepage": "https://your-username.github.io/your-repo"
   ```
3. Add these scripts to `package.json`:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d build"
   ```
4. Deploy:
   ```bash
   npm run deploy
   ```
5. Set the GitHub Pages source to the `gh-pages` branch in your repo settings.

## Usage
- **Home:**
  - Enter your hourly wage or yearly salary.
  - For yearly salary, enter hours per week after entering the salary.
  - Click **Start** to begin tracking earnings in real time.
  - Click **Reset** to save the current earning and start over.
- **Earning History:**
  - View all your past resets with timestamps and earnings.
  - Select multiple rows and delete them.
  - Download your earning history as a CSV file.
  - See a full change history, add notes, and revert to previous versions.
  - Use the Undo popup to quickly revert accidental changes.
- **Dark/Light Mode:**
  - Use the toggle in the top right to switch themes.

## Project Structure
```
Wage_App/
├── public/
│   └── index.html
├── src/
│   ├── App.tsx
│   ├── ThemeContext.tsx
│   ├── index.tsx
│   └── ...
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

---

**Enjoy tracking your earnings!** 