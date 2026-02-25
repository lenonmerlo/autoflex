export default function Alert({ type = "info", children, message }) {
  const content = message ?? children;
  return <div className={`alert alert--${type}`}>{content}</div>;
}
