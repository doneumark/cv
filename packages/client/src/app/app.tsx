// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.scss';
import AboutPage from './pages/AboutPage';
import GeneratePage from './pages/GeneratePage';

import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/generate">Generate</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/generate"
          element={
            <GeneratePage title='generate' />
          }
        />
        <Route
          path="/about"
          element={
            <AboutPage title='about' />
          }
        />
      </Routes>
      {/* END: routes */}
    </>
  );
}

export default App;
