export function Button({ className, children, ...props }) {
    return (
      <button className={`bg-blue-500 text-white p-2 rounded-md ${className}`} {...props}>
        {children}
      </button>
    );
  }
  