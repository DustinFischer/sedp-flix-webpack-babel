const ImageCard = ({ src, alt, ...props }) => {
  return (
    <div className="image-card">
      <img src={src} alt={alt || src} />
      {props.children && <div className="card-info">{props.children}</div>}
    </div>
  );
};

export default ImageCard;
