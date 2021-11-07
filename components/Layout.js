import Footer from './Footer';
import Header from './Header';

export default function Layout(props) {
  return (
    <>
      <Header username={props.username} />
      <main>{props.children}</main>
      <Footer />
    </>
  );
}
