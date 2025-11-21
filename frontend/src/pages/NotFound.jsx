import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="card" style={{ textAlign: 'center' }}>
    <h1>404</h1>
    <p>We could not find that page.</p>
    <Link className="btn" to="/">
      Go home
    </Link>
  </section>
);

export default NotFound;
