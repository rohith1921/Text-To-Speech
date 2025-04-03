/** @type {import('tailwindcss').Config} */
export const darkMode = 'class';
export const content = ["./src/**/*.{js,jsx,ts,tsx}",];
export const theme = {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#3B82F6',
        600: '#2563EB',
      },
      background: {
        light: '#F8FAFC',
        dark: '#0F172A',
      },
      surface: {
        light: '#FFFFFF',
        dark: '#1E293B',
      },
      text: {
        primary: {
          light: '#1E293B',
          dark: '#F8FAFC',
        },
        secondary: {
          light: '#64748B',
          dark: '#94A3B8',
        }
      }
    },
    transitionProperty: {
      'width': 'width'
    }
  },
};
export const plugins = [
  require('tailwind-scrollbar'),
];