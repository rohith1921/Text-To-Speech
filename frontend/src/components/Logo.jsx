// client/src/components/Logo.jsx
const Logo = ({ darkMode }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="h-10 w-10">
        {/* Outer circle */}
        <path
            fill={darkMode ? "#f8f8fc" : "#1e40af"}  // Light mode: darker blue, Dark mode: light gray
            d="M100 20c-44.1 0-80 35.9-80 80s35.9 80 80 80 80-35.9 80-80-35.9-80-80-80zm0 148c-37.6 0-68-30.4-68-68s30.4-68 68-68 68 30.4 68 68-30.4 68-68 68z"
        />

        {/* Sound waves */}
        <path
            fill={darkMode ? "#3b82f6" : "red"}  // Light mode: light gray, Dark mode: medium blue
            d="M80 90h40v20H80z M60 70h80v20H60z M100 110h40v20h-40z"
        />

        {/* Speech bubble arrow */}
        <path
            fill={darkMode ? "#60a5fa" : "red"}  // Light mode: dark blue, Dark mode: light blue
            d="M140 110l20 20-20 20V110z"
        />
    </svg>
);

export default Logo;