function Container({ className, ...props }) {
  return <div className={className ? `container ${className}` : 'container'}>{props.children}</div>;
}

export default Container;
