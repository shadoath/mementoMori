# Memento Mori Calendar

> Latin for 'Remember your death', Memento Mori is a powerful concept that's been used for centuries to help people focus on what truly matters.
> The calendar was designed as an interactive tool to help you harness the concept by visualizing your life week by week.

## Live Demo

🌐 **Deployed on Vercel**: [memento-mori.skylarbolton.com](https://memento-mori.skylarbolton.com/)

## About

This interactive calendar visualizes your life as a grid of weeks, where:
- **Filled squares** represent weeks you've already lived
- **Empty squares** represent weeks remaining in your expected lifespan
- Each row represents a year of your life (52 weeks)

Originally inspired by [Stoic Reflections](https://stoicreflections.com) and [Memento Mori Calendar](https://memento-mori-calendar.vercel.app/). 
Cloned from [afonsocrg/mementoMori](https://github.com/afonsocrg/mementoMori) and enhanced to show detailed statistics about weeks lived and remaining per year.

## Features

- **Customizable Settings**: Set your birth date and life expectancy
- **Life Statistics**: View percentage of life lived and weeks remaining  
- **Responsive Design**: Works on desktop and mobile devices
- **Print Optimized**: Formatted for A4 printing
- **Dual Implementation**: Both modern React app and simple HTML version
- **Local Storage**: Your settings are saved in your browser

## Technology Stack

- **Next.js 13** with App Router
- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **CSS Variables** for theming
- **Local Storage** for data persistence

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/mementoMori.git
cd mementoMori

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint

## Alternative Simple Version

For a lightweight implementation, check out `simple/memento_mori.html` - a standalone HTML file that works without any build process.

## Preview

<div style="text-align:center">
  <img src="https://raw.githubusercontent.com/shadoath/mementoMori/master/preview.png" />
</div>

## Contributing

Feel free to submit issues and enhancement requests!
