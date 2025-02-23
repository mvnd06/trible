export function Card({ className, children }) {
    return <div className={`bg-gray-800 p-4 rounded-lg shadow-md ${className}`}>{children}</div>;
  }
  
  export function CardContent({ className, children }) {
    return <div className={`p-2 ${className}`}>{children}</div>;
  }
  