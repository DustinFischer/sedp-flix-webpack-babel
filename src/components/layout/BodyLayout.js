import Container from '../common/Container';

function BodyLayout(props) {
  return <Container className="content">{props.children}</Container>;
}

export default BodyLayout;
